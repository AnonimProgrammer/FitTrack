import express from "express";
import * as workoutController from "../controller/workoutController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", requireAuth, workoutController.logWorkout);
router.get("/range", requireAuth, workoutController.getWorkouts)

export default router;
