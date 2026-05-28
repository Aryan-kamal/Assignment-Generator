"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      {/* Illustration */}
      <div className="relative w-48 h-48 mb-6">
        <div className="absolute inset-0 bg-gray-100 rounded-full"></div>
        <div className="absolute top-6 left-8 w-20 h-24 bg-white rounded-lg shadow-sm border border-gray-200 transform -rotate-6">
          <div className="p-2 space-y-1.5">
            <div className="h-1.5 bg-gray-200 rounded w-full"></div>
            <div className="h-1.5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-1.5 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="absolute top-4 right-6 w-20 h-24 bg-white rounded-lg shadow-sm border border-gray-200 transform rotate-6">
          <div className="p-2 space-y-1.5">
            <div className="h-1.5 bg-blue-200 rounded w-full"></div>
            <div className="h-1.5 bg-blue-200 rounded w-2/3"></div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-14 h-14 bg-white rounded-full border-4 border-purple-100 flex items-center justify-center">
          <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-2">No assignments yet</h2>
      <p className="text-sm text-gray-500 text-center max-w-sm mb-8">
        Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
      </p>
      <Link href="/assignments/create">
        <Button variant="primary" size="lg">
          + Create Your First Assignment
        </Button>
      </Link>
    </div>
  );
}
