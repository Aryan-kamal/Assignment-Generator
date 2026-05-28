import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: parseInt(process.env.PORT || "5000", 10),
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/vedaai",
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || "",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  JWT_SECRET: process.env.JWT_SECRET || "vedaai-secret-key-change-in-production",
};
