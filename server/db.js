import { DatabaseSync } from "node:sqlite";
import { dirname, resolve } from "node:path";
import { mkdirSync } from "node:fs";
import bcrypt from "bcryptjs";
import { config } from "./config.js";

const dbPath = resolve(config.databasePath);
mkdirSync(dirname(dbPath), { recursive: true });

export const db = new DatabaseSync(dbPath);
db.exec("PRAGMA foreign_keys = ON");

export function migrate() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      birth_date TEXT NOT NULL,
      belt_rank TEXT NOT NULL,
      group_name TEXT NOT NULL CHECK (group_name IN ('Kisgyerek', 'Gyerek', 'Felnőtt')),
      parent_name TEXT,
      parent_phone TEXT,
      parent_email TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('monthly', 'semester', 'annual')),
      period TEXT NOT NULL,
      paid_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
      UNIQUE(student_id, type, period)
    );

    CREATE INDEX IF NOT EXISTS idx_students_group_name ON students(group_name);
    CREATE INDEX IF NOT EXISTS idx_payments_lookup ON payments(student_id, type, period);
  `);

  const existingUser = db.prepare("SELECT id FROM users WHERE username = ?").get(config.adminUsername);
  if (!existingUser) {
    const passwordHash = bcrypt.hashSync(config.adminPassword, 12);
    db.prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)").run(config.adminUsername, passwordHash);
  }
}

export function rowToStudent(row) {
  return {
    id: row.id,
    fullName: row.full_name,
    birthDate: row.birth_date,
    beltRank: row.belt_rank,
    group: row.group_name,
    parentName: row.parent_name || "",
    parentPhone: row.parent_phone || "",
    parentEmail: row.parent_email || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
