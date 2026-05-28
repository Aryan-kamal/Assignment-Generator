"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/lib/store";
import { api } from "@/lib/api";
import { fetchAssignments } from "@/lib/slices/assignmentSlice";
import type { QuestionTypeInput } from "@/types";
import FileUpload from "@/components/create-form/FileUpload";
import DueDatePicker from "@/components/create-form/DueDatePicker";
import QuestionTypeList from "@/components/create-form/QuestionTypeList";
import AdditionalInfo from "@/components/create-form/AdditionalInfo";
import FormNavigation from "@/components/create-form/FormNavigation";

export default function CreateAssignmentPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [questionTypes, setQuestionTypes] = useState<QuestionTypeInput[]>([
    { type: "Multiple Choice Questions", count: 4, marksEach: 1 },
  ]);
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!subject.trim()) newErrors.subject = "Subject is required";
    if (!dueDate) newErrors.dueDate = "Due date is required";
    if (questionTypes.length === 0) newErrors.questionTypes = "Add at least one question type";
    if (questionTypes.some((qt) => !qt.type)) newErrors.questionTypes = "Select a type for all rows";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;

    setLoading(true);
    try {
      const totalQuestions = questionTypes.reduce((sum, qt) => sum + qt.count, 0);
      const totalMarks = questionTypes.reduce((sum, qt) => sum + qt.count * qt.marksEach, 0);

      const res = await api.createAssignment({
        title,
        subject,
        dueDate,
        questionTypes,
        totalQuestions,
        totalMarks,
        additionalInstructions: additionalInstructions || undefined,
      });

      if (res.success && res.data) {
        dispatch(fetchAssignments());
        router.push(`/assignments/${res.data.assignmentId}/paper`);
      } else {
        setErrors({ submit: res.error || "Failed to create assignment" });
      }
    } catch {
      setErrors({ submit: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <h1 className="text-xl font-bold text-gray-900">Create Assignment</h1>
        </div>
        <p className="text-sm text-gray-500">Set up a new assignment for your students.</p>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-200 rounded-full mb-8">
        <div className="h-full bg-blue-600 rounded-full w-1/2 transition-all"></div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Assignment Details</h2>
        <p className="text-sm text-gray-500 mb-6">Basic information about your assignment</p>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Quiz on Electricity"
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                errors.title ? "border-red-300" : "border-gray-200"
              }`}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Science, Mathematics, English"
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                errors.subject ? "border-red-300" : "border-gray-200"
              }`}
            />
            {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
          </div>

          {/* File Upload */}
          <FileUpload onFileSelect={setFile} />

          {/* Due Date */}
          <DueDatePicker value={dueDate} onChange={setDueDate} error={errors.dueDate} />

          {/* Question Types */}
          <QuestionTypeList
            items={questionTypes}
            onChange={setQuestionTypes}
            error={errors.questionTypes}
          />

          {/* Additional Info */}
          <AdditionalInfo
            value={additionalInstructions}
            onChange={setAdditionalInstructions}
          />
        </div>

        {errors.submit && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}
      </div>

      <FormNavigation
        onBack={() => router.back()}
        onNext={handleSubmit}
        loading={loading}
        nextLabel="Next"
      />
    </div>
  );
}
