import UserModel from "../Models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register a new User

export const registerUser = async (req, res) => {
  const { userName, password, firstName, lastName } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new UserModel({userName, password: hashedPassword, firstName, lastName});

  try {
    const oldUser = await UserModel.findOne({ userName });
    if (oldUser) {
      res.status(400).json({message: 'Username already registered!'})
    }

    const user = await newUser.save();
    const token = jwt.sign(
      { userName: user.userName, id: user._id },
      process.env.JWT_KEY,
      { expiresIn: "18h" }
    );
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login as a User

export const loginUser = async (req, res) => {
    const { userName, password } = req.body;

    try {
        const user = await UserModel.findOne({userName});

        if (user) {
            const validity = await bcrypt.compare(password, user.password);
            
            if (!validity) {
              res.status(400).json("Wrong password!");
            } else {
              const token = jwt.sign(
                { userName: user.userName, id: user._id },
                process.env.JWT_KEY,
                { expiresIn: "18h" }
              );

              res.status(200).json({ user, token });
            }
        } else {
            res.status(404).json("User does not exists!")
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
