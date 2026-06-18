import Slot from "../models/Slot.js";

export const generateSlotsForDate = async (date) => {
  const now = new Date();
  const slots = [];

  const [year, month, day] = date.split("-");

  // 6:00 AM IST = 00:30 UTC
  const startDay = new Date(
    Date.UTC(
      Number(year),
      Number(month) - 1,
      Number(day),
      0,
      30,
      0,
      0
    )
  );

  for (let i = 0; i < 24; i++) {
    const startTime = new Date(startDay);

    startTime.setUTCHours(
      startDay.getUTCHours() + i
    );

    const endTime = new Date(startTime);

    endTime.setUTCHours(
      startTime.getUTCHours() + 1
    );

    if (endTime <= now) continue;

    const exists = await Slot.findOne({
      startTime,
    });

    if (exists) continue;

    const istHour =
      new Date(startTime).toLocaleString(
        "en-IN",
        {
          timeZone: "Asia/Kolkata",
          hour: "numeric",
          hour12: false,
        }
      );

    let price = 500;

    if (
      Number(istHour) >= 17 &&
      Number(istHour) < 22
    ) {
      price = 700;
    }

    slots.push({
      startTime,
      endTime,
      price,
    });
  }

  if (slots.length > 0) {
    await Slot.insertMany(slots);

    console.log(
      `${slots.length} slots created for ${date}`
    );
  }
};
