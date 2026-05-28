"use client";

import AssignmentCard from "./AssignmentCard";
import type { Assignment } from "@/types";

interface AssignmentGridProps {
  assignments: Assignment[];
  onDelete: (id: string) => void;
}

export default function AssignmentGrid({ assignments, onDelete }: AssignmentGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {assignments.map((assignment) => (
        <AssignmentCard
          key={assignment._id}
          assignment={assignment}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
