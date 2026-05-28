import mongoose, { Schema, Document } from "mongoose";
import type { AssignmentStatus, QuestionTypeInput } from "../types";

export interface IAssignment extends Document {
  title: string;
  subject: string;
  dueDate: Date;
  questionTypes: QuestionTypeInput[];
  totalQuestions: number;
  totalMarks: number;
  additionalInstructions?: string;
  fileUrl?: string;
  status: AssignmentStatus;
  paperId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const questionTypeSchema = new Schema(
  {
    type: { type: String, required: true },
    count: { type: Number, required: true, min: 1 },
    marksEach: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const assignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    dueDate: { type: Date, required: true },
    questionTypes: { type: [questionTypeSchema], required: true },
    totalQuestions: { type: Number, required: true, min: 1 },
    totalMarks: { type: Number, required: true, min: 1 },
    additionalInstructions: { type: String },
    fileUrl: { type: String },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    paperId: { type: Schema.Types.ObjectId, ref: "QuestionPaper" },
  },
  { timestamps: true }
);

export const Assignment = mongoose.model<IAssignment>("Assignment", assignmentSchema);
