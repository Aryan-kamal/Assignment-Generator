"use client";

import QuestionTypeRow from "./QuestionTypeRow";
import type { QuestionTypeInput } from "@/types";

interface QuestionTypeListProps {
  items: QuestionTypeInput[];
  onChange: (items: QuestionTypeInput[]) => void;
  error?: string;
}

export default function QuestionTypeList({ items, onChange, error }: QuestionTypeListProps) {
  function addRow() {
    onChange([...items, { type: "", count: 4, marksEach: 1 }]);
  }

  function updateRow(index: number, data: QuestionTypeInput) {
    const updated = [...items];
    updated[index] = data;
    onChange(updated);
  }

  function removeRow(index: number) {
    if (items.length <= 1) return;
    onChange(items.filter((_, i) => i !== index));
  }

  const totalQuestions = items.reduce((sum, item) => sum + item.count, 0);
  const totalMarks = items.reduce((sum, item) => sum + item.count * item.marksEach, 0);

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-3">Question Type</label>
      <div className="space-y-3">
        {items.map((item, index) => (
          <QuestionTypeRow
            key={index}
            data={item}
            onChange={(data) => updateRow(index, data)}
            onRemove={() => removeRow(index)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={addRow}
        className="flex items-center gap-2 mt-4 text-sm text-orange-600 hover:text-orange-700 font-medium"
      >
        <span className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs">
          +
        </span>
        Add Question Type
      </button>

      <div className="text-right mt-4 space-y-0.5">
        <p className="text-sm text-gray-700">
          Total Questions : <span className="font-semibold">{totalQuestions}</span>
        </p>
        <p className="text-sm text-gray-700">
          Total Marks : <span className="font-semibold">{totalMarks}</span>
        </p>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
