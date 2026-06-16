import Booking from "../models/Booking.js";
import Slot from "../models/Slot.js";
import User from "../models/User.js";

export const createBooking = async (
  req,
  res
) => {
  try {
    const { name, phone, slotId } =
      req.body;

    const slot = await Slot.findById(
      slotId
    );

    if (!slot) {
      return res.status(404).json({
        message: "Slot not found",
      });
    }

    if (slot.status !== "available") {
      return res.status(400).json({
        message:
          "Slot not available",
      });
    }

    let user = await User.findOne({
      phone,
    });

    if (!user) {
      user = await User.create({
        name,
        phone,
      });
    }

    const booking =
  await Booking.create({
    user: user._id,

    slot: slot._id,

    name,

    phone,

    startTime:
      slot.startTime,

    endTime:
      slot.endTime,

    price:
      slot.price,

    amount:
      slot.price,

    paymentStatus:
      "pending",

    bookingStatus:
      "pending",
  });

    res.status(201).json(
      booking
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const getAllBookings =
  async (req, res) => {
    try {
      const bookings =
        await Booking.find()
          .populate(
            "user",
            "name phone"
          )
          .populate("slot")
          .sort({
            createdAt: -1,
          });

      res.json(bookings);
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };
  export const getBookingsByPhone =
  async (req, res) => {
    try {
      const { phone } =
        req.params;

      const user =
        await User.findOne({
          phone,
        });

      if (!user) {
        return res.json([]);
      }

      const bookings =
        await Booking.find({
          user: user._id,
        })
          .populate("slot")
          .sort({
            createdAt: -1,
          });

      res.json(bookings);
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };