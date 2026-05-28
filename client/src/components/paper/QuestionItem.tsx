import DifficultyBadge from "./DifficultyBadge";
import type { Question } from "@/types";

interface QuestionItemProps {
  question: Question;
  number: number;
}

export default function QuestionItem({ question, number }: QuestionItemProps) {
  return (
    <div className="flex items-start gap-2 py-1">
      <span className="text-sm text-gray-800 shrink-0">{number}.</span>
      <p className="text-sm text-gray-800 flex-1">
        {question.text}{" "}
        <span className="text-gray-500">[{question.marks} Marks]</span>
      </p>
      <div className="shrink-0 ml-2">
        <DifficultyBadge difficulty={question.difficulty} />
      </div>
    </div>
  );
}
