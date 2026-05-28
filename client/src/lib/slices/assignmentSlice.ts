import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api";
import type { Assignment } from "@/types";

interface AssignmentState {
  assignments: Assignment[];
  currentAssignment: Assignment | null;
  loading: boolean;
  error: string | null;
}

const initialState: AssignmentState = {
  assignments: [],
  currentAssignment: null,
  loading: false,
  error: null,
};

export const fetchAssignments = createAsyncThunk(
  "assignments/fetchAll",
  async (params?: { search?: string; subject?: string; sort?: string }) => {
    const res = await api.getAssignments(params);
    if (!res.success) throw new Error(res.error);
    return res.data!;
  }
);

export const fetchAssignment = createAsyncThunk(
  "assignments/fetchOne",
  async (id: string) => {
    const res = await api.getAssignment(id);
    if (!res.success) throw new Error(res.error);
    return res.data!;
  }
);

export const deleteAssignment = createAsyncThunk(
  "assignments/delete",
  async (id: string) => {
    const res = await api.deleteAssignment(id);
    if (!res.success) throw new Error(res.error);
    return id;
  }
);

const assignmentSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    updateAssignmentStatus(state, action) {
      const { assignmentId, status } = action.payload;
      const assignment = state.assignments.find((a) => a._id === assignmentId);
      if (assignment) assignment.status = status;
      if (state.currentAssignment && state.currentAssignment._id === assignmentId) {
        state.currentAssignment.status = status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch assignments";
      })
      .addCase(fetchAssignment.fulfilled, (state, action) => {
        state.currentAssignment = action.payload;
      })
      .addCase(deleteAssignment.fulfilled, (state, action) => {
        state.assignments = state.assignments.filter((a) => a._id !== action.payload);
      });
  },
});

export const { updateAssignmentStatus } = assignmentSlice.actions;
export default assignmentSlice.reducer;
