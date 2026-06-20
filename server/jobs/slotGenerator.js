import cron from "node-cron";
import Slot from "../models/Slot.js";
import {
  generateSlotsForDate,
} from "../utils/generateSlotsForDate.js";

export const startSlotGenerator =
  async () => {

    // =========================
    // INITIAL RECOVERY
    // =========================

    const slotCount =
      await Slot.countDocuments();

    if (slotCount === 0) {

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

      await generateSlotsForDate(
        today
      );

      console.log(
        `Initial slots created for ${today}`
      );
    }

    // =========================
    // 5 AM RECOVERY
    // =========================

    cron.schedule(
      "0 5 * * *",
      async () => {

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

          const exists =
            await Slot.exists({
              startTime: {
                $gte: new Date(
                  `${today}T00:00:00.000Z`
                ),
              },
            });

          if (!exists) {

            await generateSlotsForDate(
              today
            );

            console.log(
              `Recovery generated slots for ${today}`
            );
          }

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
    // 5 PM GENERATE TOMORROW
    // =========================

    cron.schedule(
      "0 17 * * *",
      async () => {

        try {

          const tomorrow =
            new Date();

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

          const beforeCount =
            await Slot.countDocuments();

          await generateSlotsForDate(
            tomorrowDate
          );

          const afterCount =
            await Slot.countDocuments();

          console.log(`
====================================
TOMORROW SLOT GENERATION
====================================
Time (IST):
${new Date().toLocaleString(
  "en-IN",
  {
    timeZone:
      "Asia/Kolkata",
  }
)}
Date Generated:
${tomorrowDate}

Slots Before:
${beforeCount}

Slots After:
${afterCount}

New Slots Added:
${afterCount - beforeCount}
====================================
`);

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
    // DELETE EXPIRED SLOTS
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
    // RELEASE HELD SLOTS
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
              `${result.modifiedCount} held slots released`
            );

          }

        } catch (error) {
          console.log(error);
        }

      }
    );

    console.log(`
====================================
RK BOX CRICKET
SLOT GENERATOR STARTED
====================================
Time (IST):
${new Date().toLocaleString(
      "en-IN",
      {
        timeZone:
          "Asia/Kolkata",
      }
    )}
====================================
`);
  };
