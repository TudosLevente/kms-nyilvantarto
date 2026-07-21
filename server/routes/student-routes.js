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
import { requireFields, isValidName, isValidBirthDate, isValidEmail } from "../utils/validation.js";

export const studentRouter = Router();

studentRouter.get("/", auth, (_req, res) => {
  res.json(listStudents());
});

studentRouter.get("/:id", auth, (req, res) => {
  const profile = getStudentProfile(Number(req.params.id));
  if (!profile) return res.status(404).json({ error: "A tanítvány nem található." });
  res.json(profile);
});

function validateStudentInput(body) {
  const missing = requireFields(body, ["fullName", "birthDate", "beltRank", "group"]);
  if (missing.length) return { error: "Hiányzó kötelező mező.", missing };

  if (!isValidName(body.fullName)) return { error: "Érvénytelen teljes név." };
  if (!isValidBirthDate(body.birthDate)) return { error: "Érvénytelen születési dátum. (A tanulónak 2 és 100 év közöttinek kell lennie)." };
  if (body.parentName && !isValidName(body.parentName)) return { error: "Érvénytelen szülő neve." };
  if (body.parentEmail && !isValidEmail(body.parentEmail)) return { error: "Érvénytelen szülő email címe." };

  return null;
}

studentRouter.post("/", auth, (req, res) => {
  const error = validateStudentInput(req.body);
  if (error) return res.status(400).json(error);
  
  res.status(201).json(createStudent(req.body));
});

studentRouter.put("/:id", auth, (req, res) => {
  const id = Number(req.params.id);
  const error = validateStudentInput(req.body);
  if (error) return res.status(400).json(error);

  const student = updateStudent(id, req.body);
  if (!student) return res.status(404).json({ error: "A tanítvány nem található." });
  res.json(student);
});

studentRouter.delete("/:id", auth, (req, res) => {
  if (!getStudent(Number(req.params.id))) return res.status(404).json({ error: "A tanítvány nem található." });
  deleteStudent(Number(req.params.id));
  res.status(204).send();
});
