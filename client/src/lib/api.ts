import type { ApiResponse, Assignment, AssignmentInput, QuestionPaper } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const res = await fetch(`${API_URL}${url}`, {
    headers: getAuthHeaders(),
    ...options,
  });
  return res.json();
}

export const api = {
  getAssignments(params?: { search?: string; subject?: string; sort?: string }) {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.subject) query.set("subject", params.subject);
    if (params?.sort) query.set("sort", params.sort);
    const qs = query.toString();
    return request<Assignment[]>(`/assignments${qs ? `?${qs}` : ""}`);
  },

  getAssignment(id: string) {
    return request<Assignment>(`/assignments/${id}`);
  },

  createAssignment(data: AssignmentInput) {
    return request<{ assignmentId: string }>("/assignments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  deleteAssignment(id: string) {
    return request<void>(`/assignments/${id}`, { method: "DELETE" });
  },

  getPaper(assignmentId: string) {
    return request<QuestionPaper>(`/assignments/${assignmentId}/paper`);
  },

  regeneratePaper(assignmentId: string) {
    return request<{ message: string }>(`/assignments/${assignmentId}/regenerate`, {
      method: "POST",
    });
  },
};
