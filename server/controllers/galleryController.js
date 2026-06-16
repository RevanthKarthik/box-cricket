import Gallery from "../models/Gallery.js";
import cloudinary from "../config/Cloudinary.js";

export const uploadImage =
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "No image uploaded",
        });
      }

      const result =
        await cloudinary.uploader.upload(
          req.file.path,
          {
            folder:
              "rk-box-cricket",
          }
        );

      const image =
        await Gallery.create({
          imageUrl:
            result.secure_url,

          publicId:
            result.public_id,
        });

      res.status(201).json(
        image
      );
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

export const getImages =
  async (req, res) => {
    try {
      const images =
        await Gallery.find().sort({
          createdAt: -1,
        });

      res.json(images);
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

export const deleteImage =
  async (req, res) => {
    try {
      const image =
        await Gallery.findById(
          req.params.id
        );

      if (!image) {
        return res.status(404).json({
          message:
            "Image not found",
        });
      }

      await cloudinary.uploader.destroy(
        image.publicId
      );

      await image.deleteOne();

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
