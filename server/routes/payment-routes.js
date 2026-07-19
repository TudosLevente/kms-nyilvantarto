import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { getStudent, togglePayment } from "../repository.js";
import { isValidPaymentType } from "../utils/validation.js";

export const paymentRouter = Router();

paymentRouter.post("/toggle", auth, (req, res) => {
  const { studentId, type } = req.body;

  if (!isValidPaymentType(type)) {
    return res.status(400).json({ error: "Ismeretlen fizetési típus." });
  }

  if (!getStudent(Number(studentId))) {
    return res.status(404).json({ error: "A tanítvány nem található." });
  }

  res.json(togglePayment(Number(studentId), type));
});
