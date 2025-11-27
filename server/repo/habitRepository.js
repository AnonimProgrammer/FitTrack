import { sql } from "../config/db.js";

export const createHabit = async ({ id, user_id, description, category }) => {
  const res = await sql`
    INSERT INTO habit (id, user_id, description, category)
    VALUES (${id}, ${user_id}, ${description}, ${category})
    RETURNING *
  `;
  return res[0];
};

export const getHabitsByUser = async (user_id) => {
  return await sql`SELECT * FROM habit WHERE user_id = ${user_id} ORDER BY created_at DESC`;
};

export const deleteHabitById = async (habit_id) => {
  await sql`DELETE FROM habit WHERE id = ${habit_id}`;
};

export const deleteHabitsByUserId = async (user_id) => {
  await sql`DELETE FROM habit WHERE user_id = ${user_id}`;
};
