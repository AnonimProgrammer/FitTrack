import express from "express";
import * as userController from "../controller/userController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", requireAuth, userController.getProfile);
router.put("/me", requireAuth, userController.updateProfile);
router.post("/reset", requireAuth, userController.resetData);
router.delete("/", requireAuth, userController.deleteAccount);

export default router;
