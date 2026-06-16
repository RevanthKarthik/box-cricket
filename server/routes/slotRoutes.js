import express from "express";

import {
  createSlot,
  getSlots,
  generateSlots,
  deleteSlot,
  toggleSlotStatus,holdSlot
} from "../controllers/slotController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/", createSlot);

router.get("/", getSlots);

router.post(
  "/generate",
  generateSlots
);
router.post(
  "/hold/:id",
  holdSlot
);
router.delete(
  "/:id",
  deleteSlot
);

router.patch(
  "/toggle/:id",
  toggleSlotStatus
);

export default router;
