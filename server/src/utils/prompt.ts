import type { QuestionTypeInput } from "../types";

interface PromptInput {
  title: string;
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

Topic / Title: ${input.title}
Subject: ${input.subject}
Total Questions: ${input.totalQuestions}
Total Marks: ${input.totalMarks}

Sections:
${sectionDescriptions}

${input.additionalInstructions ? `Additional Instructions: ${input.additionalInstructions}` : ""}

IMPORTANT: All questions MUST be specifically about "${input.title}". Do NOT generate generic questions. The title defines the exact topic.

Return ONLY valid JSON matching this exact schema. No markdown, no code fences, no explanation.

{
  "schoolName": "Dr. VSEC, Awadhpuri, Kanpur",
  "subject": "${input.subject}",
  "className": "Class/Grade",
  "timeAllowed": "appropriate time based on question count",
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
- ALL questions must be specifically about "${input.title}" — this is the topic
- Each section must have exactly the number of questions specified
- Distribute difficulty: ~40% Easy, ~40% Moderate, ~20% Challenging
- Marks per question must match the specification
- Questions must be relevant, specific, and well-crafted
- Include an answer key for all questions
- Return ONLY the JSON object, nothing else`;
}
