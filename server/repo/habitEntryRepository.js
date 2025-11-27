import { sql } from "../config/db.js";

export const upsertHabitEntry = async ({ id, habit_id, user_id, day_date, is_completed }) => {
  const res = await sql`
    INSERT INTO habit_entry (id, habit_id, user_id, day_date, is_completed)
    VALUES (${id}, ${habit_id}, ${user_id}, ${day_date}, ${is_completed})
    ON CONFLICT (habit_id, day_date) DO UPDATE SET
      is_completed = EXCLUDED.is_completed,
      updated_at = now()
    RETURNING *
  `;
  return res[0];
};

export const getEntriesByDateRange = async ({ user_id, from, to }) => {
  return await sql`
    SELECT * FROM habit_entry
    WHERE user_id = ${user_id}
      AND day_date BETWEEN ${from} AND ${to}
    ORDER BY day_date ASC;
  `;
};


export const deleteEntriesByHabitId = async (habit_id) => {
  await sql`DELETE FROM habit_entry WHERE habit_id = ${habit_id}`;
};

export const deleteEntriesByUserId = async (user_id) => {
  await sql`DELETE FROM habit_entry WHERE user_id = ${user_id}`;
};

export const getEntriesByUserAndDate = async ({ user_id, day_date }) => {
  return await sql`
    SELECT * FROM habit_entry
    WHERE user_id = ${user_id} AND day_date = ${day_date}
  `;
};
