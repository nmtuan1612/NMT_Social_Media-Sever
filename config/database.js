import Grid from "gridfs-stream";
import mongoose from "mongoose";

export const connectToDB = () => {
  try {
    const conn = mongoose.createConnection(process.env.MONGO_DB, {
      // useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    mongoose.connection.once("open", () => {
      console.log("DB connected");
    });

    let gfs;

    conn.once("open", () => {
      // Init stream
      console.log("DB Connected");
      gfs = Grid(conn.db, mongoose.mongo);
      gfs.collection("images");
    });
  } catch (error) {
    console.log(error);
  }
};
