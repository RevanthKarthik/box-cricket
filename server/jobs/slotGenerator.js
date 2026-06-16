import cron from "node-cron";

import Slot from "../models/Slot.js";

import {
  generateSlotsForDate,
} from "../utils/generateSlotsForDate.js";

export const startSlotGenerator =
  async () => {

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

    // Startup Recovery

    await generateSlotsForDate(
      today
    );

    await generateSlotsForDate(
      tomorrowDate
    );

    // Generate Tomorrow Slots Daily

    cron.schedule(
      "0 17 * * *",
      async () => {

        try {

          const tomorrow =
            new Date();

          tomorrow.setDate(
            tomorrow.getDate() +
              1
          );

          const tomorrowDate =
            `${tomorrow.getFullYear()}-${
              String(
                tomorrow.getMonth() +
                  1
              ).padStart(
                2,
                "0"
              )
            }-${
              String(
                tomorrow.getDate()
              ).padStart(
                2,
                "0"
              )
            }`;

          await generateSlotsForDate(
            tomorrowDate
          );

          console.log(
            "Tomorrow slots generated"
          );

        } catch (error) {
          console.log(error);
        }

      }
    );

    // Delete Expired Slots Daily

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

      }
    );

    console.log(
      "Slot Generator Started"
    );
  };