import { paperResponseSchema } from "../validators/assignment.validator";
import type { PaperOutput } from "../types";

export function parseLLMResponse(raw: string): PaperOutput {
  let cleaned = raw.trim();

  // Strip markdown code fences if present
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
  }

  const parsed = JSON.parse(cleaned);
  const validated = paperResponseSchema.parse(parsed);
  return validated as PaperOutput;
}
