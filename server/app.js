import express from "express";
import cors from "cors";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { migrate } from "./db.js";
import { config } from "./config.js";
import { authRouter } from "./routes/auth-routes.js";
import { dashboardRouter } from "./routes/dashboard-routes.js";
import { paymentRouter } from "./routes/payment-routes.js";
import { studentRouter } from "./routes/student-routes.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distPath = resolve(__dirname, "../dist");

export function createApp() {
  migrate();

  const app = express();
  app.use(cors({ origin: config.allowedOrigins }));
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "node", database: config.databasePath });
  });

  app.use("/api/auth", authRouter);
  app.use("/api", dashboardRouter);
  app.use("/api/students", studentRouter);
  app.use("/api/payments", paymentRouter);

  if (existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get(/^(?!\/api).*/, (_req, res) => {
      res.sendFile(join(distPath, "index.html"));
    });
  }

  return app;
}
