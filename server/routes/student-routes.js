import { Router } from "express";
import { auth } from "../middleware/auth.js";
import {
  createStudent,
  deleteStudent,
  getStudent,
  getStudentProfile,
  listStudents,
  updateStudent,
} from "../repository.js";
import { requireFields } from "../utils/validation.js";

export const studentRouter = Router();

studentRouter.get("/", auth, (_req, res) => {
  res.json(listStudents());
});

studentRouter.get("/:id", auth, (req, res) => {
  const profile = getStudentProfile(Number(req.params.id));
  if (!profile) return res.status(404).json({ error: "A tanítvány nem található." });
  res.json(profile);
});

studentRouter.post("/", auth, (req, res) => {
  const missing = requireFields(req.body, ["fullName", "birthDate", "beltRank", "group"]);
  if (missing.length) return res.status(400).json({ error: "Hiányzó kötelező mező.", missing });
  res.status(201).json(createStudent(req.body));
});

studentRouter.put("/:id", auth, (req, res) => {
  const id = Number(req.params.id);
  const missing = requireFields(req.body, ["fullName", "birthDate", "beltRank", "group"]);
  if (missing.length) return res.status(400).json({ error: "Hiányzó kötelező mező.", missing });

  const student = updateStudent(id, req.body);
  if (!student) return res.status(404).json({ error: "A tanítvány nem található." });
  res.json(student);
});

studentRouter.delete("/:id", auth, (req, res) => {
  if (!getStudent(Number(req.params.id))) return res.status(404).json({ error: "A tanítvány nem található." });
  deleteStudent(Number(req.params.id));
  res.status(204).send();
});
