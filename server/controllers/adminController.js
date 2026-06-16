import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Admin from "../models/Admin.js";

export const loginAdmin =
  async (req, res) => {

    try {

      const {
        username,
        password,
      } = req.body;


      const admin =
        await Admin.findOne({
          username,
        });

      if (!admin) {
        return res.status(401).json({
          message:
            "Admin not found",
        });
      }

const match =
  await bcrypt.compare(
    password,
    admin.password
  );


      if (!match) {
        return res.status(401).json({
          message:
            "Wrong password",
        });
      }

      res.json({
        success: true,
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          error.message,
      });
    }
  };