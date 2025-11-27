import { v4 as uuidv4 } from "uuid";
import * as userRepo from "../repo/userRepository.js";
import * as habitRepo from "../repo/habitRepository.js";
import * as habitEntryRepo from "../repo/habitEntryRepository.js";
import * as workoutRepo from "../repo/workoutRepository.js";

export const getProfile = async (user_id) => {
  return await userRepo.findUserById(user_id);
};

export const updateProfile = async ({ user_id, fullname, bio }) => {
  return await userRepo.updateUser({ id: user_id, fullname, bio });
};

export const resetUserData = async (user_id) => {
  // delete habit entries, workouts and habits
  await habitEntryRepo.deleteEntriesByUserId(user_id);
  await workoutRepo.deleteWorkoutsByUserId(user_id);
  await habitRepo.deleteHabitsByUserId(user_id);

  // recreate default habits
  const DEFAULT_HABITS = [
    { description: "Morning workout", category: "Fitness" },
    { description: "Drink 8 glasses of water", category: "Health" },
    { description: "Meditate for 10 minutes", category: "Wellness" },
    { description: "10,000 steps", category: "Fitness" },
    { description: "Track calories", category: "Nutrition" }
  ];

  for (const h of DEFAULT_HABITS) {
    await habitRepo.createHabit({ id: uuidv4(), user_id, description: h.description, category: h.category });
  }

  return { ok: true };
};

export const deleteAccount = async (user_id) => {
  // deleting user row will cascade delete child rows because of ON DELETE CASCADE
  await userRepo.deleteUserById(user_id);
  return { ok: true };
};
