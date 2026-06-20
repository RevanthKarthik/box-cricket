import cron from "node-cron";
import Slot from "../models/Slot.js";
import {
  generateSlotsForDate,
} from "../utils/generateSlotsForDate.js";

export const startSlotGenerator =
  async () => {

    // =========================
    // ENSURE TODAY & TOMORROW SLOTS EXIST
    // (Runs whenever backend starts)
    // =========================

    try {

      const now =
        new Date();

      const today =
        `${now.getFullYear()}-${
          String(
            now.getMonth() + 1
          ).padStart(2, "0")
        }-${
          String(
            now.getDate()
          ).padStart(2, "0")
        }`;

      const tomorrow =
        new Date(now);

      tomorrow.setDate(
        tomorrow.getDate() + 1
      );

      const tomorrowDate =
        `${tomorrow.getFullYear()}-${
          String(
            tomorrow.getMonth() + 1
          ).padStart(2, "0")
        }-${
          String(
            tomorrow.getDate()
          ).padStart(2, "0")
        }`;

      const todayExists =
        await Slot.findOne({
          startTime: {
            $gte: new Date(
              `${today}T00:00:00.000Z`
            ),
            $lt: new Date(
              `${today}T23:59:59.999Z`
            ),
          },
        });

      if (!todayExists) {

        await generateSlotsForDate(
          today
        );

        console.log(
          `Today's slots created (${today})`
        );
      }

      const tomorrowExists =
        await Slot.findOne({
          startTime: {
            $gte: new Date(
              `${tomorrowDate}T00:00:00.000Z`
            ),
            $lt: new Date(
              `${tomorrowDate}T23:59:59.999Z`
            ),
          },
        });

      if (!tomorrowExists) {

        await generateSlotsForDate(
          tomorrowDate
        );

        console.log(
          `Tomorrow's slots created (${tomorrowDate})`
        );
      }

    } catch (error) {

      console.log(
        "Startup slot generation error:",
        error
      );

    }

    // =========================
    // DELETE EXPIRED SLOTS DAILY
    // =========================

    cron.schedule(
      "5 0 * * *",
      async () => {

        try {

          const result =
            await Slot.deleteMany({
              endTime: {
                $lt:
                  new Date(),
              },
            });

          console.log(
            `${result.deletedCount} expired slots removed`
          );

        } catch (error) {

          console.log(error);

        }

      },
      {
        timezone:
          "Asia/Kolkata",
      }
    );

    // =========================
    // RELEASE EXPIRED HOLDS
    // =========================

    cron.schedule(
      "* * * * *",
      async () => {

        try {

          const result =
            await Slot.updateMany(
              {
                status:
                  "hold",

                holdUntil: {
                  $lt:
                    new Date(),
                },
              },
              {
                status:
                  "available",

                holdUntil:
                  null,
              }
            );

          if (
            result.modifiedCount >
            0
          ) {

            console.log(
              `${result.modifiedCount} hold slot(s) released`
            );

          }

        } catch (error) {

          console.log(error);

        }

      }
    );

    console.log(
      "RK Box Cricket Slot Generator Started"
    );
  };
