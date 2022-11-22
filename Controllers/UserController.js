import UserModel from "../Models/userModel.js";
import PostModel from "../Models/postModel.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";

// Get a user
export const getUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await UserModel.findById(id);

    if (user) {
      const { password, ...otherDetails } = user._doc;
      res.status(200).json(otherDetails);
    } else {
      res.status(404).json("No such user exists");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getAllUsers = async (req, res) => {
  const { listIds } = req.body;

  try {
    let users = [];
    if (listIds) {
      users = await UserModel.find({ _id: { $in: listIds.map(id => new mongoose.Types.ObjectId(id)) }});
    } else {
      users = await UserModel.find();
    }
    users = users.map((user) => {
      const { password, ...otherDetails } = user._doc;
      return otherDetails;
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Update a User
export const updateUser = async (req, res) => {
  const id = req.params.id;
  const { _id, isAdmin, password } = req.body;
  
  if (id === _id || isAdmin) {
    try {
      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }

      const user = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      const token = jwt.sign(
        { userName: user.userName, id: user._id },
        process.env.JWT_KEY,
        { expiresIn: "18h" }
      );

      res.status(200).json({user, token});
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res
      .status(403)
      .json("Access Denied! You can only update your own profile.");
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserId, currentUserAdminStatus } = req.body;

  if (id === currentUserId || currentUserAdminStatus) {
    try {
      await UserModel.findByIdAndDelete(id);
      res.status(200).json("User deleted successfully!");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res
      .status(403)
      .json("Action Denied! You can only delete your own profile.");
  }
};

// Follow a user
export const followUser = async (req, res) => {
  const followedUserId = req.params.id;
  const { _id: currentUserId } = req.body;

  if (currentUserId === followedUserId) {
    res.status(403).json("Action forbidden!");
  } else {
    try {
      const followedUser = await UserModel.findById(followedUserId);
      const followingUser = await UserModel.findById(currentUserId);

      if (!followedUser.followers.includes(currentUserId)) {
        await followedUser.updateOne({ $push: { followers: currentUserId } });
        await followingUser.updateOne({ $push: { following: followedUserId } });
        res.status(200).json("User followed!");
      } else {
        res.status(403).json("User is Already followed by you!");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

// UnFollow a user
export const unFollowUser = async (req, res) => {
  const unFollowedUserId = req.params.id;
  const { _id: currentUserId } = req.body;

  if (currentUserId === unFollowedUserId) {
    res.status(403).json("Action forbidden!");
  } else {
    try {
      const unFollowedUser = await UserModel.findById(unFollowedUserId);
      const unFollowingUser = await UserModel.findById(currentUserId);

      if (unFollowedUser.followers.includes(currentUserId)) {
        await unFollowedUser.updateOne({ $pull: { followers: currentUserId } });
        await unFollowingUser.updateOne({ $pull: { following: unFollowedUserId } });
        res.status(200).json("User unfollowed!")
      } else {
        res.status(403).json("User is not followed by you!");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

// get search results
export const getSearchResults = async (req, res) => {
  let searchKey = req.query.text;

  try {
    if (searchKey.includes("#")) {
      const userResults = await PostModel.find({ desc: { $regex: searchKey, $options: "i" } });
      res.status(200).json(userResults);
    } else {
      const userResults = await UserModel.find({ userName: { $regex: searchKey, $options: "i" } });
      res.status(200).json(userResults);
    }
  } catch (error) {
    console.log(error);
  }
};
