"use client";

interface CounterProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export default function Counter({ value, onChange, min = 1, max = 100 }: CounterProps) {
  return (
    <div className="flex items-center gap-1 border border-gray-200 rounded-lg">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="px-2.5 py-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-l-lg transition-colors"
      >
        &minus;
      </button>
      <span className="w-8 text-center text-sm font-medium tabular-nums">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="px-2.5 py-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-r-lg transition-colors"
      >
        +
      </button>
    </div>
  );
}
