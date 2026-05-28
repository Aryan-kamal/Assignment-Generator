import { configureStore } from "@reduxjs/toolkit";
import assignmentReducer from "./slices/assignmentSlice";
import paperReducer from "./slices/paperSlice";

export const store = configureStore({
  reducer: {
    assignments: assignmentReducer,
    paper: paperReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
