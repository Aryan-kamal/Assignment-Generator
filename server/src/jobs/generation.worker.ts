import { Worker, Job } from "bullmq";
import { redis } from "../config/redis";
import { Assignment } from "../models/Assignment.model";
import { QuestionPaper } from "../models/QuestionPaper.model";
import { generateQuestionPaper } from "../services/llm.service";
import { emitToRoom } from "../ws/socket";

interface JobData {
  assignmentId: string;
}

async function processGeneration(job: Job<JobData>) {
  const { assignmentId } = job.data;

  try {
    await Assignment.findByIdAndUpdate(assignmentId, { status: "processing" });
    emitToRoom(assignmentId, "generation-started", { assignmentId });

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) throw new Error("Assignment not found");

    const paperData = await generateQuestionPaper({
      title: assignment.title,
      subject: assignment.subject,
      questionTypes: assignment.questionTypes,
      totalQuestions: assignment.totalQuestions,
      totalMarks: assignment.totalMarks,
      additionalInstructions: assignment.additionalInstructions,
    });

    const paper = await QuestionPaper.create({
      assignmentId,
      ...paperData,
    });

    await Assignment.findByIdAndUpdate(assignmentId, {
      status: "completed",
      paperId: paper._id,
    });

    // Cache the paper in Redis for 1 hour
    await redis.setex(
      `paper:${assignmentId}`,
      3600,
      JSON.stringify(paper.toObject())
    );

    emitToRoom(assignmentId, "generation-completed", {
      assignmentId,
      paperId: paper._id?.toString(),
    });
  } catch (error) {
    console.error("Generation failed:", error);
    await Assignment.findByIdAndUpdate(assignmentId, { status: "failed" });
    emitToRoom(assignmentId, "generation-failed", {
      assignmentId,
      error: (error as Error).message,
    });
    throw error;
  }
}

export function startWorker() {
  const worker = new Worker("question-generation", processGeneration, {
    connection: redis as any,
    concurrency: 2,
  });

  worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} failed:`, err.message);
  });

  console.log("BullMQ worker started");
  return worker;
}
