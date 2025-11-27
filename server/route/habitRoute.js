import express from "express";
import * as habitController from "../controller/habitController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", requireAuth, habitController.createHabit);
router.get("/", requireAuth, habitController.getHabits);
router.delete("/:id", requireAuth, habitController.deleteHabit);

router.put("/:id/entry", requireAuth, habitController.upsertEntry);
router.get("/entries/today", requireAuth, habitController.getTodayEntries);
router.get("/entries/range", requireAuth, habitController.getEntriesByRange);

export default router;
