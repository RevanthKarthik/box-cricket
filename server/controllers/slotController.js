import Slot from "../models/Slot.js";

export const createSlot = async (
  req,
  res
) => {
  try {
    const {
      startTime,
      endTime,
      price,
    } = req.body;

    const slot = await Slot.create({
      startTime,
      endTime,
      price,
    });

    res.status(201).json(slot);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getSlots = async (
  req,
  res
) => {
  try {
   const now =
  new Date();

const slots =
  await Slot.find({
    endTime: {
      $gt: now,
    },

    $or: [
      {
        status:
          "available",
      },
      {
        status:
          "booked",
      },
      {
        status:
          "blocked",
      },
      {
        status:
          "hold",

        holdUntil: {
          $gt:
            new Date(),
        },
      },
    ],
  }).sort({
    startTime: 1,
  });

    res.json(slots);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const generateSlots =
  async (req, res) => {
    try {
      const { date } = req.body;

      if (!date) {
        return res
          .status(400)
          .json({
            message:
              "Date required",
          });
      }
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

      const slots = [];

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

        const hour =
          startTime.getHours();

        let price = 500;

        if (
          hour >= 17 &&
          hour < 22
        ) {
          price = 700;
        }

        const exists =
          await Slot.findOne({
            startTime,
          });

        if (!exists) {
          slots.push({
            startTime,
            endTime,
            price,
          });
        }
      }

      const created =
        await Slot.insertMany(
          slots
        );

      res.status(201).json({
        success: true,
        count:
          created.length,
        slots: created,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };
  export const deleteSlot = async (
  req,
  res
) => {
  try {
    const slot =
      await Slot.findByIdAndDelete(
        req.params.id
      );

    if (!slot) {
      return res.status(404).json({
        message: "Slot not found",
      });
    }

    res.json({
      success: true,
      message:
        "Slot deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const toggleSlotStatus =
  async (req, res) => {
    try {
      const slot =
        await Slot.findById(
          req.params.id
        );

      if (!slot) {
        return res.status(404).json({
          message: "Slot not found",
        });
      }

      if (
        slot.status === "blocked"
      ) {
        slot.status =
          "available";
      } else if (
        slot.status === "available"
      ) {
        slot.status =
          "blocked";
      } else {
        return res.status(400).json({
          message:
            "Booked slots cannot be modified",
        });
      }

      await slot.save();

      res.json({
        success: true,
        status: slot.status,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
  export const holdSlot =
  async (req, res) => {
    try {

      const slot =
        await Slot.findById(
          req.params.id
        );

      if (!slot) {
        return res.status(404)
          .json({
            message:
              "Slot not found",
          });
      }

      if (
        slot.status !==
        "available"
      ) {
        return res.status(400)
          .json({
            message:
              "Slot unavailable",
          });
      }

      slot.status =
        "hold";

      slot.holdUntil =
        new Date(
          Date.now() +
          10 * 60 * 1000
        );

      await slot.save();

      res.json({
        success: true,
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  };
