import { z } from "zod";

export const questionTypeSchema = z.object({
  type: z.string().min(1, "Question type is required"),
  count: z.number().int().min(1, "Count must be at least 1"),
  marksEach: z.number().min(1, "Marks must be at least 1"),
});

export const createAssignmentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subject: z.string().min(1, "Subject is required"),
  dueDate: z.string().min(1, "Due date is required"),
  questionTypes: z.array(questionTypeSchema).min(1, "At least one question type is required"),
  totalQuestions: z.number().int().min(1),
  totalMarks: z.number().min(1),
  additionalInstructions: z.string().optional(),
  fileUrl: z.string().optional(),
});

export const paperResponseSchema = z.object({
  schoolName: z.string().optional(),
  subject: z.string(),
  className: z.string().optional(),
  timeAllowed: z.string().optional(),
  maxMarks: z.number(),
  generalInstruction: z.string(),
  sections: z.array(
    z.object({
      title: z.string(),
      subtitle: z.string(),
      instruction: z.string(),
      questions: z.array(
        z.object({
          text: z.string(),
          difficulty: z.enum(["Easy", "Moderate", "Challenging"]),
          marks: z.number(),
          type: z.string(),
        })
      ),
    })
  ),
  answerKey: z
    .array(
      z.object({
        questionNumber: z.number(),
        answer: z.string(),
      })
    )
    .optional(),
});
