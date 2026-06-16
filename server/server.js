import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import adminRoutes
from "./routes/adminRoutes.js";
import {
  startSlotGenerator,
} from "./jobs/slotGenerator.js";
import connectDB from "./config/db.js";

import slotRoutes from "./routes/slotRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";

dotenv.config();

const app = express();

connectDB();

/* CORS FIRST */
app.use(
  cors({
    origin:
      "https://rk-box-cricket.netlify.app",
    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
    ],
    credentials: true,
  })
);

app.use(express.json());

/* Routes */

app.use(
  "/api/gallery",
  galleryRoutes
);

app.use(
  "/api/slots",
  slotRoutes
);

app.use(
  "/api/bookings",
  bookingRoutes
);
app.use(
  "/api/admin",
  adminRoutes
);
app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
  "/api/payments",
  paymentRoutes
);


const PORT =
  process.env.PORT || 5000;
await startSlotGenerator();
app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});
