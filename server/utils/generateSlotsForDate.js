import Slot from "../models/Slot.js";

export const generateSlotsForDate = async (date) => {
  const now = new Date();
  const slots = [];

  const [year, month, day] = date.split("-");

  // Base day configuration (Hardcoding 6:00:00.000 AM)
  const startDay = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    6,  // Start Hour
    0,  // Minutes
    0,  // Seconds
    0   // Milliseconds
  );

  for (let i = 0; i < 24; i++) {
    const startTime = new Date(startDay);

    // FIX: Force the hour calculation AND lock minutes/seconds/ms to exactly 0
    startTime.setHours(startDay.getHours() + i, 0, 0, 0);

    const endTime = new Date(startTime);
    // FIX: Force end time minutes/seconds/ms to exactly 0 as well
    endTime.setHours(startTime.getHours() + 1, 0, 0, 0);

    // Don't recreate expired slots
    if (endTime <= now) {
      continue;
    }

    // Check if this precise slot already exists in MongoDB
    const exists = await Slot.findOne({ startTime });
    if (exists) {
      continue;
    }

    const hour = startTime.getHours();
    let price = 500;

    // Peak hours pricing logic (5 PM to 10 PM)
    if (hour >= 17 && hour < 22) {
      price = 700;
    }

    slots.push({
      startTime,
      endTime,
      price,
    });
  }

  // Batch insert to optimize database calls
  if (slots.length > 0) {
    await Slot.insertMany(slots);
    console.log(`${slots.length} slots successfully created for ${date}`);
  }
};
