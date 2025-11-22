import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

export const sql = neon(
  `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require&channel_binding=require`
);

// postgresql://neondb_owner:npg_lTOY4M5SfvKe@ep-calm-lake-aghzngjk-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require