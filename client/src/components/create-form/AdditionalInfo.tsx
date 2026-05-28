"use client";

interface AdditionalInfoProps {
  value: string;
  onChange: (value: string) => void;
}

export default function AdditionalInfo({ value, onChange }: AdditionalInfoProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-2">
        Additional Information <span className="font-normal text-gray-400">(For better output)</span>
      </label>
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g Generate a question paper for 3 hour exam duration..."
          rows={3}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
        />
        <button
          type="button"
          className="absolute bottom-3 right-3 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
