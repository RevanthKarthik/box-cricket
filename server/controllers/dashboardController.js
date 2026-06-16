import Booking from "../models/Booking.js";
import User from "../models/User.js";

export const getDashboardStats =
  async (req, res) => {
    try {

      const today =
        new Date();

      today.setHours(
        0,
        0,
        0,
        0
      );

      const tomorrow =
        new Date(today);

      tomorrow.setDate(
        tomorrow.getDate() + 1
      );

      const startMonth =
        new Date(
          today.getFullYear(),
          today.getMonth(),
          1
        );

      const todayBookings =
        await Booking.find({
          paymentStatus:
            "paid",
          createdAt: {
            $gte: today,
            $lt: tomorrow,
          },
        });

      const monthlyBookings =
        await Booking.find({
          paymentStatus:
            "paid",
          createdAt: {
            $gte:
              startMonth,
          },
        });

      const allPaidBookings =
        await Booking.find({
          paymentStatus:
            "paid",
        });

      const totalBookings =
        await Booking.countDocuments();

      const totalCustomers =
        await User.countDocuments();

      const todayRevenue =
        todayBookings.reduce(
          (
            total,
            booking
          ) =>
            total +
            booking.amount,
          0
        );

      const monthlyRevenue =
        monthlyBookings.reduce(
          (
            total,
            booking
          ) =>
            total +
            booking.amount,
          0
        );

      const lifetimeRevenue =
        allPaidBookings.reduce(
          (
            total,
            booking
          ) =>
            total +
            booking.amount,
          0
        );

      res.json({
        todayRevenue,
        monthlyRevenue,
        lifetimeRevenue,
        totalBookings,
        totalCustomers,
      });

    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

export const getDashboardBookings =
  async (req, res) => {

    try {

      const bookings =
  await Booking.find()
    .sort({
      bookingDate: -1,
    });

      res.json(
        bookings
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }

  };