import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const accessTokenSecret = process.env.JWT_KEY;

const authMiddleWare = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).send("Can not find access token!");
    }
    const decoded = jwt.verify(token, accessTokenSecret);
    if (!decoded) {
      return res.status(401).json("Wrong access token!");
    }

    req.body._id = decoded?.id;
    next();
  } catch (error) {
    console.log(error);
  }
};

export default authMiddleWare;
