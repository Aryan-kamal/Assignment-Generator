export interface QuestionTypeInput {
  type: string;
  count: number;
  marksEach: number;
}

export interface AssignmentInput {
  title: string;
  subject: string;
  dueDate: string;
  questionTypes: QuestionTypeInput[];
  totalQuestions: number;
  totalMarks: number;
  additionalInstructions?: string;
  fileUrl?: string;
}

export type AssignmentStatus = "pending" | "processing" | "completed" | "failed";

export interface QuestionOutput {
  text: string;
  difficulty: "Easy" | "Moderate" | "Challenging";
  marks: number;
  type: string;
}

export interface SectionOutput {
  title: string;
  subtitle: string;
  instruction: string;
  questions: QuestionOutput[];
}

export interface AnswerKeyItem {
  questionNumber: number;
  answer: string;
}

export interface PaperOutput {
  schoolName?: string;
  subject: string;
  className?: string;
  timeAllowed?: string;
  maxMarks: number;
  generalInstruction: string;
  sections: SectionOutput[];
  answerKey?: AnswerKeyItem[];
}
