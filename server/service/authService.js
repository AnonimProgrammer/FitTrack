import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import * as userRepo from "../repo/userRepository.js";
import * as habitRepo from "../repo/habitRepository.js";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const TOKEN_EXPIRES = "7d";

const DEFAULT_HABITS = [
  { description: "Morning workout", category: "Fitness" },
  { description: "Drink 8 glasses of water", category: "Health" },
  { description: "Meditate for 10 minutes", category: "Wellness" },
  { description: "10,000 steps", category: "Fitness" },
  { description: "Track calories", category: "Nutrition" }
];

export const register = async ({ fullname, email, password }) => {
  const existing = await userRepo.findUserByEmail(email);
  if (existing) throw new Error("Email already registered");

  const hashed = await bcrypt.hash(password, 10);
  const id = uuidv4();
  const user = await userRepo.createUser({ id, fullname, email, password: hashed });

  for (const h of DEFAULT_HABITS) {
    await habitRepo.createHabit({ id: uuidv4(), user_id: id, description: h.description, category: h.category });
  }

  const token = jwt.sign({ userId: user.id }, ACCESS_TOKEN_SECRET, { expiresIn: TOKEN_EXPIRES });
  return { user, token };
};

export const login = async ({ email, password }) => {
  const user = await userRepo.findUserByEmail(email);
  if (!user) throw new Error("Invalid credentials");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error("Invalid credentials");

  // return user without password
  const safeUser = {
    id: user.id,
    fullname: user.fullname,
    email: user.email,
    bio: user.bio,
    created_at: user.created_at,
    updated_at: user.updated_at
  };

  const token = jwt.sign({ userId: user.id }, ACCESS_TOKEN_SECRET, { expiresIn: TOKEN_EXPIRES });
  return { user: safeUser, token };
};
