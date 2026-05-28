import OpenAI from "openai";
import { env } from "../config/env";
import { buildPrompt } from "../utils/prompt";
import { parseLLMResponse } from "../utils/parser";
import type { PaperOutput, QuestionTypeInput } from "../types";

const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: env.OPENROUTER_API_KEY,
});

interface GenerateInput {
  title: string;
  subject: string;
  questionTypes: QuestionTypeInput[];
  totalQuestions: number;
  totalMarks: number;
  additionalInstructions?: string;
}

export async function generateQuestionPaper(
  input: GenerateInput,
  maxRetries = 2
): Promise<PaperOutput> {
  const prompt = buildPrompt(input);
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const completion = await openrouter.chat.completions.create({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              "You are an expert exam paper generator. You always return valid JSON and nothing else.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 4096,
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) throw new Error("Empty response from LLM");

      return parseLLMResponse(content);
    } catch (error) {
      lastError = error as Error;
      console.error(`LLM attempt ${attempt + 1} failed:`, lastError.message);
    }
  }

  throw new Error(`Failed to generate paper after ${maxRetries + 1} attempts: ${lastError?.message}`);
}
