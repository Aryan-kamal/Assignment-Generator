"use client";

import { useState, useRef } from "react";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
}

export default function FileUpload({ onFileSelect }: FileUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    setFileName(file.name);
    onFileSelect(file);
  }

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
        isDragging ? "border-orange-400 bg-orange-50" : "border-gray-200 bg-gray-50"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.pdf,.txt"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      <div className="flex flex-col items-center gap-3">
        <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
        </svg>
        {fileName ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">{fileName}</span>
            <button
              type="button"
              onClick={() => {
                setFileName(null);
                onFileSelect(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="text-red-500 hover:text-red-700"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600">
              Choose a file or drag & drop it here
            </p>
            <p className="text-xs text-gray-400">JPEG, PNG, upto 10MB</p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-white transition-colors"
            >
              Browse Files
            </button>
          </>
        )}
      </div>
      <p className="text-xs text-gray-400 mt-3">
        Upload images of your preferred document/image
      </p>
    </div>
  );
}
