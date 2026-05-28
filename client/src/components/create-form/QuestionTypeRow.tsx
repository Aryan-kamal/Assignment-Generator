"use client";

import Counter from "@/components/ui/Counter";
import DropdownSelect from "@/components/ui/DropdownSelect";
import type { QuestionTypeInput } from "@/types";

const QUESTION_TYPE_OPTIONS = [
  { label: "Multiple Choice Questions", value: "Multiple Choice Questions" },
  { label: "Short Questions", value: "Short Questions" },
  { label: "Long Answer Questions", value: "Long Answer Questions" },
  { label: "Diagram/Graph-Based Questions", value: "Diagram/Graph-Based Questions" },
  { label: "Numerical Problems", value: "Numerical Problems" },
  { label: "True/False", value: "True/False" },
  { label: "Fill in the Blanks", value: "Fill in the Blanks" },
];

interface QuestionTypeRowProps {
  data: QuestionTypeInput;
  onChange: (data: QuestionTypeInput) => void;
  onRemove: () => void;
}

export default function QuestionTypeRow({ data, onChange, onRemove }: QuestionTypeRowProps) {
  return (
    <div className="border border-gray-200 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <DropdownSelect
            value={data.type}
            onChange={(type) => onChange({ ...data, type })}
            options={QUESTION_TYPE_OPTIONS}
            placeholder="Select question type"
          />
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="mt-1 p-1 text-gray-400 hover:text-red-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex items-center gap-6 mt-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">No. of Questions</label>
          <Counter
            value={data.count}
            onChange={(count) => onChange({ ...data, count })}
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Marks</label>
          <Counter
            value={data.marksEach}
            onChange={(marksEach) => onChange({ ...data, marksEach })}
          />
        </div>
      </div>
    </div>
  );
}
