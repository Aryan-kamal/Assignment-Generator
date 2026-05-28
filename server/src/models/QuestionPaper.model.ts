import mongoose, { Schema, Document } from "mongoose";
import type { SectionOutput, AnswerKeyItem } from "../types";

export interface IQuestionPaper extends Document {
  assignmentId: mongoose.Types.ObjectId;
  schoolName?: string;
  subject: string;
  className?: string;
  timeAllowed?: string;
  maxMarks: number;
  generalInstruction: string;
  sections: SectionOutput[];
  answerKey?: AnswerKeyItem[];
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new Schema(
  {
    text: { type: String, required: true },
    difficulty: { type: String, enum: ["Easy", "Moderate", "Challenging"], required: true },
    marks: { type: Number, required: true },
    type: { type: String, required: true },
  },
  { _id: false }
);

const sectionSchema = new Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    instruction: { type: String, required: true },
    questions: { type: [questionSchema], required: true },
  },
  { _id: false }
);

const answerKeySchema = new Schema(
  {
    questionNumber: { type: Number, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

const questionPaperSchema = new Schema<IQuestionPaper>(
  {
    assignmentId: { type: Schema.Types.ObjectId, ref: "Assignment", required: true },
    schoolName: { type: String },
    subject: { type: String, required: true },
    className: { type: String },
    timeAllowed: { type: String },
    maxMarks: { type: Number, required: true },
    generalInstruction: { type: String, required: true },
    sections: { type: [sectionSchema], required: true },
    answerKey: { type: [answerKeySchema] },
  },
  { timestamps: true }
);

export const QuestionPaper = mongoose.model<IQuestionPaper>("QuestionPaper", questionPaperSchema);
