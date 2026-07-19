import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db.js";
import { config } from "../config.js";

export function login(username, password) {
  const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);

  if (!user || !bcrypt.compareSync(password || "", user.password_hash)) {
    return null;
  }

  return {
    token: jwt.sign({ sub: user.id, username: user.username }, config.jwtSecret, { expiresIn: "12h" }),
    user: { id: user.id, username: user.username },
  };
}
