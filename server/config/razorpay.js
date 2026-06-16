import Razorpay from "razorpay";
import dotenv from "dotenv";

// Explicitly call dotenv here to force-load the variables before the constructor runs
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default razorpay;