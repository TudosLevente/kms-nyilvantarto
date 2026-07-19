import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT || 3001),
  pythonServiceUrl: process.env.PYTHON_SERVICE_URL || "http://127.0.0.1:8001",
  databasePath: process.env.DATABASE_PATH || "./data/kms.sqlite",
  jwtSecret: process.env.JWT_SECRET || "dev-only-change-me",
  adminUsername: process.env.ADMIN_USERNAME || "admin",
  adminPassword: process.env.ADMIN_PASSWORD || "admin123",
  allowedOrigins: (process.env.ALLOWED_ORIGINS || "http://127.0.0.1:5173,http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};
