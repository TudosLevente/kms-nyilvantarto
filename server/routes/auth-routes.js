import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { login } from "../services/auth-service.js";

export const authRouter = Router();

authRouter.post("/login", (req, res) => {
  const result = login(req.body.username, req.body.password);

  if (!result) {
    return res.status(401).json({ error: "Hibás felhasználónév vagy jelszó." });
  }

  return res.json(result);
});

authRouter.get("/me", auth, (req, res) => {
  res.json({ user: { id: req.user.sub, username: req.user.username } });
});
