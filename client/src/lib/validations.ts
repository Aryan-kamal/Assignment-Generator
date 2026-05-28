import { z } from "zod";

export const questionTypeSchema = z.object({
  type: z.string().min(1, "Question type is required"),
  count: z.number().int().min(1, "Must have at least 1 question"),
  marksEach: z.number().min(1, "Marks must be at least 1"),
});

export const createAssignmentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subject: z.string().min(1, "Subject is required"),
  dueDate: z.string().min(1, "Due date is required"),
  questionTypes: z.array(questionTypeSchema).min(1, "At least one question type is required"),
  additionalInstructions: z.string().optional(),
});
