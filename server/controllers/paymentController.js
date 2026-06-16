import crypto from "crypto";
import razorpay from "../config/razorpay.js";

import Booking from "../models/Booking.js";
import Payment from "../models/Payment.js";
import Slot from "../models/Slot.js";


// CREATE ORDER

export const createOrder = async (
  req,
  res
) => {
  try {
    const { bookingId } = req.body;

    const booking =
      await Booking.findById(
        bookingId
      );

    if (!booking) {
      return res.status(404).json({
        message:
          "Booking not found",
      });
    }

    const options = {
      amount:
        booking.amount * 100,
      currency: "INR",
      receipt:
        booking._id.toString(),
    };

    const order =
      await razorpay.orders.create(
        options
      );

    await Payment.create({
      booking: booking._id,
      razorpayOrderId: order.id,
      amount: booking.amount,
      status: "created",
    });

    res.status(200).json(
      order
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// VERIFY PAYMENT

export const verifyPayment = async (
  req,
  res
) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env
            .RAZORPAY_KEY_SECRET
        )
        .update(
          razorpay_order_id +
            "|" +
            razorpay_payment_id
        )
        .digest("hex");

    if (
      generatedSignature !==
      razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payment verification failed",
      });
    }

    const payment =
      await Payment.findOne({
        razorpayOrderId:
          razorpay_order_id,
      });

    if (!payment) {
      return res.status(404).json({
        message:
          "Payment record not found",
      });
    }

    payment.razorpayPaymentId =
      razorpay_payment_id;

    payment.razorpaySignature =
      razorpay_signature;

    payment.status =
      "captured";

    await payment.save();

    const booking =
      await Booking.findById(
        payment.booking
      );

    booking.paymentStatus =
      "paid";

    booking.bookingStatus =
      "confirmed";

    await booking.save();

    const slot =
      await Slot.findById(
        booking.slot
      );

    slot.status = "booked";

    slot.bookingId =
      booking._id;

    await slot.save();

    res.status(200).json({
      success: true,
      message:
        "Payment verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};