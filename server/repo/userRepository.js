import { sql } from "../config/db.js";

export const createUser = async ({ id, fullname, email, password }) => {
  const res = await sql`
    INSERT INTO "user" (id, fullname, email, password)
    VALUES (${id}, ${fullname}, ${email}, ${password})
    RETURNING id, fullname, email, created_at, updated_at
  `;
  return res[0];
};

export const findUserByEmail = async (email) => {
  const res = await sql`SELECT * FROM "user" WHERE email = ${email}`;
  return res[0];
};

export const findUserById = async (id) => {
  const res = await sql`SELECT id, fullname, email, bio, created_at, updated_at FROM "user" WHERE id = ${id}`;
  return res[0];
};

export const deleteUserById = async (id) => {
  await sql`DELETE FROM "user" WHERE id = ${id}`;
};

export const updateUser = async ({ id, fullname, bio }) => {
  const res = await sql`
    UPDATE "user"
    SET fullname = ${fullname}, bio = ${bio}, updated_at = now()
    WHERE id = ${id}
    RETURNING id, fullname, email, bio, created_at, updated_at
  `;
  return res[0];
};
