import { v4 as uuidv4 } from "uuid";
import * as habitRepo from "../repo/habitRepository.js";
import * as habitEntryRepo from "../repo/habitEntryRepository.js";

export const createHabit = async ({ user_id, description, category }) => {
  return await habitRepo.createHabit({ id: uuidv4(), user_id, description, category });
};

export const getHabits = async (user_id) => {
  return await habitRepo.getHabitsByUser(user_id);
};

export const deleteHabit = async (habit_id) => {
  await habitEntryRepo.deleteEntriesByHabitId(habit_id);
  await habitRepo.deleteHabitById(habit_id);
  return { ok: true };
};

export const upsertHabitEntry = async ({ habit_id, user_id, is_completed }) => {
  const day_date = new Date().toLocaleDateString("en-CA"); 
  return await habitEntryRepo.upsertHabitEntry({
    id: uuidv4(),
    habit_id,
    user_id,
    day_date,
    is_completed
  }); 
};

export const getTodayEntries = async (user_id) => {
  const day_date = new Date().toLocaleDateString("en-CA"); 
  return await habitEntryRepo.getEntriesByUserAndDate({ user_id, day_date });
};

export const getEntriesByRange = async (user_id, from, to) => {
  return await habitEntryRepo.getEntriesByDateRange({ user_id, from, to });
};
