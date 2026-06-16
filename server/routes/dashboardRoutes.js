import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import {
  getDashboardStats,
  getDashboardBookings,
} from "../controllers/dashboardController.js";

const router =
  express.Router();

router.get(
  "/stats",
  getDashboardStats
);

router.get(
  "/bookings",
  getDashboardBookings
);

export default router;