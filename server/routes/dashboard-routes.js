import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { buildOverview } from "../repository.js";
import { getAnalytics } from "../services/analytics-service.js";

export const dashboardRouter = Router();

dashboardRouter.get("/overview", auth, (_req, res) => {
  res.json(buildOverview());
});

dashboardRouter.get("/analytics", auth, async (_req, res) => {
  res.json(await getAnalytics());
});
