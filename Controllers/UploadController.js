import upload from "../MiddleWare/uploadMiddleWare.js";
import { MongoClient } from 'mongodb';

export const uploadFiles = async (req, res) => {
  try {
    await upload(req, res);
    console.log(req.file);

    if (req.file == undefined) {
      return res.json({
        message: "You must select a file.",
      });
    }

    return res.json({
      message: "File has been uploaded.",
    });
  } catch (error) {
    console.log(error);

    return res.json({
      message: "Error when trying upload image: ${error}",
    });
  }
};

export const getFile = async (req, res) => {
  try {
    await mongoClient.connect();

    const database = mongoClient.db(dbConfig.database);
    const images = database.collection(dbConfig.imgBucket + ".files");

    const cursor = images.find({});

    if ((await cursor.count()) === 0) {
      return res.status(500).send({
        message: "No files found!",
      });
    }

    let fileInfos = [];
    await cursor.forEach((doc) => {
      fileInfos.push({
        name: doc.filename,
        url: baseUrl + doc.filename,
      });
    });

    return res.status(200).send(fileInfos);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};
