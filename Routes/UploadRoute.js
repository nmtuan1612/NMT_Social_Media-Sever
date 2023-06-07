import express from "express";
import multer from "multer";
// import { uploadFiles } from "../Controllers/UploadController.js";
import MediaModel from "../Models/mediaModel.js";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: "duyb3dqsr",
  api_key: "342793919844576",
  api_secret: "A08ZGUh5JUT5nueg3cc0RA6gmUE",
});

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

const fileUpload = multer();

router.post("/", fileUpload.single("file"), async (req, res) => {
  try {
    if (req.file) {
      let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          let stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          });

          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      async function upload(req) {
        let result = await streamUpload(req);
        res
          .status(200)
          .json({ message: "File uploaded successfully.", url: result.url });
      }

      await upload(req);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// router.post("/", (req, res) => {
//   upload(req, res, (err) => {
//     if (err) {
//       console.log(err);
//     } else {
//       const newFile = new MediaModel({
//         name: Date.now() + req.body.name,
//         file: {
//           data: req.file.filename,
//           contentType: "image/png",
//         },
//       });
//       newFile
//         .save()
//         .then(() => res.status(200).json("File uploaded successfully."))
//         .catch((error) => console.log(error));
//     }
//   });
// });

// router.get("/:name", )

export default router;
