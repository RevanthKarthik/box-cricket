import Slot from "../models/Slot.js";

export const generateSlotsForDate =
  async (date) => {

    const now =
      new Date();

    const slots = [];

    const [year, month, day] =
  date.split("-");

const startDay =
  new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    6,
    0,
    0,
    0
  );

    for (
      let i = 0;
      i < 24;
      i++
    ) {

      const startTime =
        new Date(startDay);

      startTime.setHours(
        startDay.getHours() +
          i
      );

      const endTime =
        new Date(startTime);

      endTime.setHours(
        startTime.getHours() +
          1
      );

      // Don't recreate expired slots

      if (
        endTime <= now
      ) {
        continue;
      }

      const exists =
        await Slot.findOne({
          startTime,
        });

      if (exists)
        continue;

      const hour =
        startTime.getHours();

      let price = 500;

      if (
        hour >= 17 &&
        hour < 22
      ) {
        price = 700;
      }

      slots.push({
        startTime,
        endTime,
        price,
      });
    }

    if (
      slots.length > 0
    ) {

      await Slot.insertMany(
        slots
      );

      console.log(
        `${slots.length} slots created for ${date}`
      );
    }
  };
