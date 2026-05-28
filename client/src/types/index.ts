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

export interface Assignment {
  _id: string;
  title: string;
  subject: string;
  dueDate: string;
  questionTypes: QuestionTypeInput[];
  totalQuestions: number;
  totalMarks: number;
  additionalInstructions?: string;
  fileUrl?: string;
  status: AssignmentStatus;
  paperId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  text: string;
  difficulty: "Easy" | "Moderate" | "Challenging";
  marks: number;
  type: string;
}

export interface Section {
  title: string;
  subtitle: string;
  instruction: string;
  questions: Question[];
}

export interface AnswerKeyItem {
  questionNumber: number;
  answer: string;
}

export interface QuestionPaper {
  _id: string;
  assignmentId: string;
  schoolName?: string;
  subject: string;
  className?: string;
  timeAllowed?: string;
  maxMarks: number;
  generalInstruction: string;
  sections: Section[];
  answerKey?: AnswerKeyItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Array<{ message: string; path: string[] }>;
}
