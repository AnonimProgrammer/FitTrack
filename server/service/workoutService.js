import { v4 as uuidv4 } from "uuid";
import * as workoutRepo from "../repo/workoutRepository.js";

export const logWorkout = async ({ user_id, description, type, duration, calories_burned }) => {
  return await workoutRepo.createWorkout({
    id: uuidv4(),
    user_id,
    description,
    type,
    duration,
    calories_burned
  });
};

export const getWorkoutsSince = async (user_id, from) => {
  return await workoutRepo.getWorkoutsByUserRange({ user_id, from });
};
