import type { QuestionTypeInput } from "../types";

interface PromptInput {
  subject: string;
  questionTypes: QuestionTypeInput[];
  totalQuestions: number;
  totalMarks: number;
  additionalInstructions?: string;
}

export function buildPrompt(input: PromptInput): string {
  const sectionDescriptions = input.questionTypes
    .map(
      (qt, i) =>
        `Section ${String.fromCharCode(65 + i)}: ${qt.count} ${qt.type} questions, each worth ${qt.marksEach} marks`
    )
    .join("\n");

  return `You are an expert exam paper generator. Generate a structured question paper based on the following requirements.

Subject: ${input.subject}
Total Questions: ${input.totalQuestions}
Total Marks: ${input.totalMarks}

Sections:
${sectionDescriptions}

${input.additionalInstructions ? `Additional Instructions: ${input.additionalInstructions}` : ""}

IMPORTANT: Return ONLY valid JSON matching this exact schema. No markdown, no code fences, no explanation.

{
  "schoolName": "Dr. VSEC, Awadhpuri, Kanpur",
  "subject": "${input.subject}",
  "className": "Class V",
  "timeAllowed": "appropriate time",
  "maxMarks": ${input.totalMarks},
  "generalInstruction": "All questions are compulsory unless stated otherwise.",
  "sections": [
    {
      "title": "Section A",
      "subtitle": "Type of questions",
      "instruction": "Attempt all questions. Each question carries X marks",
      "questions": [
        {
          "text": "Question text here",
          "difficulty": "Easy|Moderate|Challenging",
          "marks": number,
          "type": "question type"
        }
      ]
    }
  ],
  "answerKey": [
    {
      "questionNumber": 1,
      "answer": "Brief answer"
    }
  ]
}

Rules:
- Each section must have exactly the number of questions specified
- Distribute difficulty: ~40% Easy, ~40% Moderate, ~20% Challenging
- Marks per question must match the specification
- Questions must be relevant to the subject
- Include an answer key for all questions
- Return ONLY the JSON object, nothing else`;
}
