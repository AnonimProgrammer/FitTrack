import { sql } from "../config/db.js";

export const createWorkout = async ({ id, user_id, description, type, duration, calories_burned }) => {
  const res = await sql`
    INSERT INTO workout (id, user_id, description, type, duration, calories_burned)
    VALUES (${id}, ${user_id}, ${description}, ${type}, ${duration}, ${calories_burned})
    RETURNING *
  `;
  return res[0];
};

export const getWorkoutsByUserRange = async ({ user_id, from }) => {
  return await sql`
    SELECT * FROM workout
    WHERE user_id = ${user_id} AND created_at >= ${from}
    ORDER BY created_at DESC
  `;
};

export const deleteWorkoutsByUserId = async (user_id) => {
  await sql`DELETE FROM workout WHERE user_id = ${user_id}`;
};
