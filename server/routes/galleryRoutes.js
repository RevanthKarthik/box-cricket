import express from "express";
import multer from "multer";

import {
  uploadImage,
  getImages,
  deleteImage,
} from "../controllers/galleryController.js";

const router =
  express.Router();

const upload = multer({
  dest: "uploads/",
});

router.post(
  "/",
  upload.single("image"),
  uploadImage
);

router.get("/", getImages);

router.delete(
  "/:id",
  deleteImage
);

export default router;