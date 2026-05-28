import type { Request, Response } from "express";
import { Assignment } from "../models/Assignment.model";
import { QuestionPaper } from "../models/QuestionPaper.model";
import { generationQueue } from "../config/queue";
import { redis } from "../config/redis";
import { createAssignmentSchema } from "../validators/assignment.validator";

export async function createAssignment(req: Request, res: Response) {
  try {
    const parsed = createAssignmentSchema.parse(req.body);

    const assignment = await Assignment.create({
      ...parsed,
      dueDate: new Date(parsed.dueDate),
      status: "pending",
    });

    await generationQueue.add("generate", {
      assignmentId: assignment._id?.toString(),
    });

    res.status(201).json({
      success: true,
      data: { assignmentId: assignment._id },
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({ success: false, errors: error.errors });
      return;
    }
    console.error("Create assignment error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export async function getAssignments(req: Request, res: Response) {
  try {
    const { search, status, subject, sort } = req.query;
    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
      ];
    }
    if (status) {
      filter.status = status;
    }
    if (subject) {
      filter.subject = subject;
    }

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    else if (sort === "due_soon") sortOption = { dueDate: 1 };

    const assignments = await Assignment.find(filter).sort(sortOption);
    res.json({ success: true, data: assignments });
  } catch (error) {
    console.error("Get assignments error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export async function getAssignment(req: Request, res: Response) {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      res.status(404).json({ success: false, error: "Assignment not found" });
      return;
    }
    res.json({ success: true, data: assignment });
  } catch (error) {
    console.error("Get assignment error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export async function deleteAssignment(req: Request, res: Response) {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) {
      res.status(404).json({ success: false, error: "Assignment not found" });
      return;
    }
    await QuestionPaper.deleteMany({ assignmentId: req.params.id });
    await redis.del(`paper:${req.params.id}`);
    res.json({ success: true });
  } catch (error) {
    console.error("Delete assignment error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export async function getPaper(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Check Redis cache first
    const cached = await redis.get(`paper:${id}`);
    if (cached) {
      res.json({ success: true, data: JSON.parse(cached) });
      return;
    }

    const paper = await QuestionPaper.findOne({ assignmentId: id }).sort({ createdAt: -1 });
    if (!paper) {
      res.status(404).json({ success: false, error: "Paper not found" });
      return;
    }

    // Cache for future requests
    await redis.setex(`paper:${id}`, 3600, JSON.stringify(paper.toObject()));
    res.json({ success: true, data: paper });
  } catch (error) {
    console.error("Get paper error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export async function regeneratePaper(req: Request, res: Response) {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      res.status(404).json({ success: false, error: "Assignment not found" });
      return;
    }

    await Assignment.findByIdAndUpdate(req.params.id, { status: "pending" });
    await redis.del(`paper:${req.params.id}`);

    await generationQueue.add("generate", {
      assignmentId: req.params.id,
    });

    res.json({ success: true, message: "Regeneration started" });
  } catch (error) {
    console.error("Regenerate error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}
