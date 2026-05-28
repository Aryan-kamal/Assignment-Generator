import type { QuestionPaper } from "@/types";

interface PaperHeaderProps {
  paper: QuestionPaper;
}

export default function PaperHeader({ paper }: PaperHeaderProps) {
  return (
    <div className="text-center mb-6">
      {paper.schoolName && (
        <h1 className="text-xl font-bold text-gray-900 mb-1">{paper.schoolName}</h1>
      )}
      <div className="text-sm text-gray-700 space-y-0.5">
        <p>Subject: {paper.subject}</p>
        {paper.className && <p>Class: {paper.className}</p>}
      </div>
      <div className="flex justify-between mt-4 text-sm text-gray-700">
        {paper.timeAllowed && <p>Time Allowed: {paper.timeAllowed}</p>}
        <p>Maximum Marks: {paper.maxMarks}</p>
      </div>
      <p className="text-sm text-gray-700 text-left mt-4">{paper.generalInstruction}</p>
    </div>
  );
}
