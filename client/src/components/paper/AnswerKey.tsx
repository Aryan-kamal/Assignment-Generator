import type { AnswerKeyItem } from "@/types";

interface AnswerKeyProps {
  answers: AnswerKeyItem[];
}

export default function AnswerKey({ answers }: AnswerKeyProps) {
  if (!answers || answers.length === 0) return null;

  return (
    <div className="mt-10 pt-6 border-t border-gray-300">
      <h3 className="font-bold text-base text-gray-900 mb-4">Answer Key:</h3>
      <ol className="space-y-2 list-decimal list-inside">
        {answers.map((item) => (
          <li key={item.questionNumber} className="text-sm text-gray-700">
            {item.answer}
          </li>
        ))}
      </ol>
    </div>
  );
}
