"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Assignment } from "@/types";

interface AssignmentCardProps {
  assignment: Assignment;
  onDelete: (id: string) => void;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function isDueToday(dateStr: string) {
  const due = new Date(dateStr);
  const now = new Date();
  due.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  return due.getTime() === now.getTime();
}

function isOverdue(dateStr: string) {
  const due = new Date(dateStr);
  const now = new Date();
  due.setHours(23, 59, 59, 999);
  return due < now;
}

export default function AssignmentCard({ assignment, onDelete }: AssignmentCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const dueToday = isDueToday(assignment.dueDate);
  const overdue = isOverdue(assignment.dueDate);
  const urgent = dueToday || overdue;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleCardClick(e: React.MouseEvent) {
    if (menuRef.current?.contains(e.target as Node)) return;
    router.push(`/assignments/${assignment._id}/paper`);
  }

  return (
    <div
      onClick={handleCardClick}
      className={`bg-white border rounded-xl p-5 hover:shadow-md transition-shadow relative cursor-pointer ${
        urgent ? "border-red-300 border-l-4 border-l-red-500" : "border-gray-200"
      }`}
    >
      {urgent && (
        <span className="absolute top-3 right-14 flex items-center gap-1">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          <span className="text-[10px] font-semibold text-red-600 uppercase">
            {overdue ? "Overdue" : "Due Today"}
          </span>
        </span>
      )}

      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-gray-900 text-base pr-8">{assignment.title}</h3>
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-40 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  router.push(`/assignments/${assignment._id}/paper`);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                View Assignment
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(assignment._id);
                  setMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-1">{assignment.subject}</p>

      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
        <span>Assigned on : {formatDate(assignment.createdAt)}</span>
        <span className={urgent ? "text-red-600 font-medium" : ""}>
          Due : {formatDate(assignment.dueDate)}
        </span>
      </div>

      {assignment.status === "processing" && (
        <div className="mt-3">
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full animate-pulse w-2/3"></div>
          </div>
          <span className="text-xs text-orange-600 mt-1">Generating...</span>
        </div>
      )}
      {assignment.status === "failed" && (
        <span className="inline-block mt-3 text-xs text-red-500 font-medium">Generation failed</span>
      )}
    </div>
  );
}
