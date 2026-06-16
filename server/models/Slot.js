import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {
    startTime: {
      type: Date,
      required: true,
    },
    holdUntil: {
  type: Date,
  default: null,
},
    endTime: {
      type: Date,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["available","hold", "booked", "blocked"],
      default: "available",
    },

    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },
  },
  { timestamps: true }
);

slotSchema.index({ startTime: 1 });

export default mongoose.model("Slot", slotSchema);
