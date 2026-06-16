import express from "express";

import {
  createBooking,
  getAllBookings,
  getBookingsByPhone,
} from "../controllers/bookingController.js";

const router =
  express.Router();

router.post(
  "/",
  createBooking
);

router.get(
  "/",
  getAllBookings
);

router.get(
  "/history/:phone",
  getBookingsByPhone
);

export default router;