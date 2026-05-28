import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api";
import type { QuestionPaper } from "@/types";

interface PaperState {
  paper: QuestionPaper | null;
  loading: boolean;
  error: string | null;
  generationStatus: "idle" | "pending" | "processing" | "completed" | "failed";
}

const initialState: PaperState = {
  paper: null,
  loading: false,
  error: null,
  generationStatus: "idle",
};

export const fetchPaper = createAsyncThunk(
  "paper/fetch",
  async (assignmentId: string) => {
    const res = await api.getPaper(assignmentId);
    if (!res.success) throw new Error(res.error);
    return res.data!;
  }
);

export const regeneratePaper = createAsyncThunk(
  "paper/regenerate",
  async (assignmentId: string) => {
    const res = await api.regeneratePaper(assignmentId);
    if (!res.success) throw new Error(res.error);
    return assignmentId;
  }
);

const paperSlice = createSlice({
  name: "paper",
  initialState,
  reducers: {
    setGenerationStatus(state, action) {
      state.generationStatus = action.payload;
    },
    clearPaper(state) {
      state.paper = null;
      state.generationStatus = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaper.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaper.fulfilled, (state, action) => {
        state.loading = false;
        state.paper = action.payload;
        state.generationStatus = "completed";
      })
      .addCase(fetchPaper.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch paper";
      })
      .addCase(regeneratePaper.fulfilled, (state) => {
        state.paper = null;
        state.generationStatus = "pending";
      });
  },
});

export const { setGenerationStatus, clearPaper } = paperSlice.actions;
export default paperSlice.reducer;
