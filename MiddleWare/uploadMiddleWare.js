// import { promisify } from "util";
// import multer from "multer";
// import { GridFsStorage } from "multer-gridfs-storage";

// const storage = new GridFsStorage({
//   url: process.env.MONGO_DB,
//   options: { useNewUrlParser: true, useUnifiedTopology: true },
//   file: (req, file) => {
//     const match = ["image/png", "image/jpeg"];

//     if (match.indexOf(file.mimetype) === -1) {
//       const filename = `${Date.now()}${file.originalname}`;
//       return filename;
//     }

//     return {
//       bucketName: process.env.MEDIA_BUCKET_NAME,
//       filename: `${Date.now()}${file.originalname}`,
//     };
//   },
// });

// const uploadFiles = multer({ storage: storage }).single("file");
// const uploadFilesMiddleware = promisify(uploadFiles);

// export default uploadFilesMiddleware;
