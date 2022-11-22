import express from "express";
import multer from "multer";
// import { uploadFiles } from "../Controllers/UploadController.js";
import MediaModel from "../Models/mediaModel.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage }).single("file");

// router.post("/", uploadFiles, (req, res) => {
router.post("/", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
    } else {
      const newFile = new MediaModel({
        name: Date.now() + req.body.name,
        file: {
          data: req.file.filename,
          contentType: "image/png",
        },
      });
      newFile
        .save()
        .then(() => res.status(200).json("File uploaded successfully."))
        .catch((error) => console.log(error));
    }
  });
});

// router.get("/:name", )

export default router;
