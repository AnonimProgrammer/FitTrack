import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./route/authRoute.js";
import userRoutes from "./route/userRoute.js";
import habitRoutes from "./route/habitRoute.js";
import workoutRoutes from "./route/workoutRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  credentials: true
}));
app.use(helmet());
app.use(morgan("dev"));

// api routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/habits", habitRoutes);
app.use("/workouts", workoutRoutes);

app.get("/test", (req, res) => res.send("API OK"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
