import express from "express";
import cors from "cors";
import http from "http";
import { env } from "./config/env";
import { connectDB } from "./config/db";
import { initWebSocket } from "./ws/socket";
import { startWorker } from "./jobs/generation.worker";
import { authMiddleware } from "./middleware/auth";
import authRoutes from "./routes/auth.routes";
import assignmentRoutes from "./routes/assignment.routes";

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: env.CLIENT_URL.replace(/\/+$/, ""), credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/assignments", authMiddleware, assignmentRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

async function start() {
  await connectDB();
  initWebSocket(server);
  startWorker();

  server.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
}

start().catch(console.error);
