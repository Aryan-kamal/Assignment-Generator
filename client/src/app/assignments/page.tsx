"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import type { AppDispatch, RootState } from "@/lib/store";
import { fetchAssignments, deleteAssignment } from "@/lib/slices/assignmentSlice";
import AssignmentGrid from "@/components/assignments/AssignmentGrid";
import EmptyState from "@/components/assignments/EmptyState";
import SearchFilter from "@/components/assignments/SearchFilter";
import Button from "@/components/ui/Button";
import type { Assignment } from "@/types";

function isUrgent(dateStr: string) {
  const due = new Date(dateStr);
  const now = new Date();
  due.setHours(23, 59, 59, 999);
  now.setHours(0, 0, 0, 0);
  return due <= now || due.toDateString() === new Date().toDateString();
}

export default function AssignmentsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { assignments, loading } = useSelector((state: RootState) => state.assignments);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    dispatch(fetchAssignments());
  }, [dispatch]);

  const subjects = useMemo(() => {
    const set = new Set(assignments.map((a) => a.subject));
    return Array.from(set).sort();
  }, [assignments]);

  const filteredAndSorted = useMemo(() => {
    let result = [...assignments];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) => a.title.toLowerCase().includes(q) || a.subject.toLowerCase().includes(q)
      );
    }

    if (subjectFilter) {
      result = result.filter((a) => a.subject === subjectFilter);
    }

    // Separate urgent (due today / overdue) and normal
    const urgent: Assignment[] = [];
    const normal: Assignment[] = [];
    result.forEach((a) => {
      if (isUrgent(a.dueDate)) urgent.push(a);
      else normal.push(a);
    });

    const sortFn = (list: Assignment[]) => {
      switch (sortBy) {
        case "oldest":
          return list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        case "due_soon":
          return list.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        default:
          return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    };

    return [...sortFn(urgent), ...sortFn(normal)];
  }, [assignments, search, subjectFilter, sortBy]);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      if (confirm("Are you sure you want to delete this assignment?")) {
        dispatch(deleteAssignment(id));
      }
    },
    [dispatch]
  );

  if (loading && assignments.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <h1 className="text-xl font-bold text-gray-900">Assignments</h1>
        </div>
        <p className="text-sm text-gray-500">Manage and create assignments for your classes.</p>
      </div>

      {assignments.length === 0 && !search ? (
        <EmptyState />
      ) : (
        <>
          <div className="mb-6">
            <SearchFilter
              search={search}
              onSearchChange={handleSearch}
              subjectFilter={subjectFilter}
              onSubjectFilterChange={setSubjectFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
              subjects={subjects}
            />
          </div>
          {filteredAndSorted.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-sm">
              No assignments match your filters.
            </div>
          ) : (
            <AssignmentGrid assignments={filteredAndSorted} onDelete={handleDelete} />
          )}
          <div className="flex justify-center mt-8">
            <Link href="/assignments/create">
              <Button variant="primary" size="lg">
                + Create Assignment
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
