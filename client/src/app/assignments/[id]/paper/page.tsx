"use client";

import { useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/lib/store";
import { fetchAssignment } from "@/lib/slices/assignmentSlice";
import { fetchPaper, regeneratePaper, setGenerationStatus } from "@/lib/slices/paperSlice";
import { useSocket } from "@/hooks/useSocket";
import AIBanner from "@/components/paper/AIBanner";
import PaperHeader from "@/components/paper/PaperHeader";
import StudentInfo from "@/components/paper/StudentInfo";
import SectionBlock from "@/components/paper/SectionBlock";
import AnswerKey from "@/components/paper/AnswerKey";

export default function PaperPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { currentAssignment } = useSelector((state: RootState) => state.assignments);
  const { paper, loading, error, generationStatus } = useSelector(
    (state: RootState) => state.paper
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchAssignment(id));
      dispatch(fetchPaper(id));
    }
  }, [id, dispatch]);

  const handleGenerationCompleted = useCallback(() => {
    dispatch(setGenerationStatus("completed"));
    dispatch(fetchPaper(id));
  }, [dispatch, id]);

  const handleGenerationStarted = useCallback(() => {
    dispatch(setGenerationStatus("processing"));
  }, [dispatch]);

  const handleGenerationFailed = useCallback(() => {
    dispatch(setGenerationStatus("failed"));
  }, [dispatch]);

  useSocket(id, {
    "generation-completed": handleGenerationCompleted,
    "generation-started": handleGenerationStarted,
    "generation-failed": handleGenerationFailed,
  });

  const handleRegenerate = () => {
    dispatch(regeneratePaper(id));
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const isGenerating =
    generationStatus === "pending" ||
    generationStatus === "processing" ||
    currentAssignment?.status === "processing" ||
    currentAssignment?.status === "pending";

  if (loading && !paper) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-gray-500">Loading paper...</p>
      </div>
    );
  }

  if (isGenerating && !paper) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-orange-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="text-center">
          <p className="font-medium text-gray-900">Generating your question paper...</p>
          <p className="text-sm text-gray-500 mt-1">This may take a moment. Please wait.</p>
        </div>
      </div>
    );
  }

  if (error && !paper) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
          <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <div className="text-center">
          <p className="font-medium text-gray-900">Generation failed</p>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
        </div>
        <button
          onClick={handleRegenerate}
          className="px-5 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No paper found for this assignment.</p>
      </div>
    );
  }

  let questionCounter = 1;

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      <AIBanner
        subject={paper.subject}
        onDownloadPDF={handleDownloadPDF}
        onRegenerate={handleRegenerate}
        regenerating={generationStatus === "pending" || generationStatus === "processing"}
      />

      {/* Paper */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 lg:p-10 shadow-sm print:shadow-none print:border-none">
        <PaperHeader paper={paper} />
        <StudentInfo className="mt-6 mb-2" />

        {paper.sections.map((section, index) => {
          const startNum = questionCounter;
          questionCounter += section.questions.length;
          return (
            <SectionBlock
              key={index}
              section={section}
              startNumber={startNum}
            />
          );
        })}

        <p className="text-center text-sm font-semibold text-gray-700 mt-8">
          End of Question Paper
        </p>

        {paper.answerKey && <AnswerKey answers={paper.answerKey} />}
      </div>
    </div>
  );
}
