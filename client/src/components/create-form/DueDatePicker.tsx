"use client";

interface DueDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function DueDatePicker({ value, onChange, error }: DueDatePickerProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-2">Due Date</label>
      <div className="relative">
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="DD-MM-YYYY"
          className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors ${
            error ? "border-red-300" : "border-gray-200"
          }`}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
