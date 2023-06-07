import mongoose from "mongoose";
import PostModel from "../Models/postModel.js";
import UserModel from "../Models/userModel.js";
import CommentModel from "../Models/commentModel.js";

// Create new Post
export const createPost = async (req, res) => {
  const newPost = new PostModel(req.body);

  try {
    const post = await newPost.save();
    const authorData = await UserModel.findById(
      post.userId,
      "_id profilePicture followers"
    );

    const completeInfoPost = {
      ...post._doc,
      authorData,
    };
    res.status(200).json(completeInfoPost);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get a post
export const getPost = async (req, res) => {
  const id = req.params.id;

  try {
    const post = await PostModel.findById(id);
    const authorData = await UserModel.findById(
      post.userId,
      "_id profilePicture followers"
    );

    const completeInfoPost = {
      ...post._doc,
      authorData,
    };
    res.status(200).json(completeInfoPost);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Update a post
export const updatePost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;

  try {
    // const post = await PostModel.findById(postId);

    // if (post.userId === userId) {
    const updatedPost = await PostModel.findByIdAndUpdate(postId, req.body, {
      new: true,
    });

    const authorData = await UserModel.findById(
      userId,
      "_id profilePicture followers"
    );

    const completeUpdatedPost = {
      ...updatedPost._doc,
      authorData,
    };
    res.status(200).json(completeUpdatedPost);
    // } else {
    //   res.status(403).json("Action forbidden!");
    // }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Delete post
export const deletePost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(postId);
    if (post.userId === userId) {
      await post.deleteOne();
      await CommentModel.deleteMany({ postId });
      res.status(200).json(post);
    } else {
      res.status(403).json("Action forbidden!");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Like/dislike a post
export const likePost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(postId);

    if (!post.likes.includes(userId)) {
      const post = await PostModel.findByIdAndUpdate(
        postId,
        { $push: { likes: userId } },
        { new: true }
      );
      res.status(200).json(post);
    } else {
      const post = await PostModel.findByIdAndUpdate(
        postId,
        { $pull: { likes: userId } },
        { new: true }
      );
      res.status(200).json(post);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Save post
export const savePost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(postId);
    if (!post.usersSaved.includes(userId)) {
      const savedPost = await post.updateOne(
        { $push: { usersSaved: userId } }
        // { new: true }
      );
      res.status(200).json(savedPost);
    } else {
      await post.updateOne({ $pull: { usersSaved: userId } });
      res.status(200).json("Post unsaved!");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Hide post
export const hidePost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(postId);
    if (post.userId === userId) {
      const updatedPost = await PostModel.findByIdAndUpdate(
        postId,
        { visibility: !post.visibility },
        { new: true }
      );
      res.status(200).json(updatedPost);
    } else {
      res.status(403).json("Action forbidden!");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getUserPosts = async (req, res) => {
  const userProfileId = req.params.id;
  const { userId } = req.body;

  try {
    if (userId === userProfileId) {
      const userProfilePosts = await PostModel.find({
        userId: userProfileId,
      }).sort({ createdAt: -1 });

      const postsOfUser = [];
      const authorData = await UserModel.findById(
        userId,
        "_id profilePicture followers"
      );
      for (const post of userProfilePosts) {
        const completeInfoPost = {
          ...post._doc,
          authorData,
        };
        postsOfUser.push(completeInfoPost);
      }
      res.status(200).json(postsOfUser);
    } else {
      const userProfilePosts = await PostModel.find({
        userId: userProfileId,
        visibility: true,
      }).sort({ createdAt: -1 });

      const postsOfUser = [];
      const authorData = await UserModel.findById(
        userProfileId,
        "_id profilePicture followers"
      );
      for (const post of userProfilePosts) {
        const completeInfoPost = {
          ...post._doc,
          authorData,
        };
        postsOfUser.push(completeInfoPost);
      }
      res.status(200).json(postsOfUser);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getSavedPost = async (req, res) => {
  const userId = req.params.id;

  try {
    const savedPosts = await PostModel.find({
      usersSaved: { $elemMatch: { $eq: userId } },
    });
    res.status(200).json(savedPosts);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get timeline post
export const getTimelinePost = async (req, res) => {
  const userId = req.params.id;

  try {
    const currentUserPosts = await PostModel.find({ userId: userId });
    const followingPosts = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "following",
          foreignField: "userId",
          // pipeline: [{ $limit: 4 }],
          as: "followingPosts",
        },
      },
      {
        $project: {
          _id: 0,
          followingPosts: 1,
        },
      },
    ]);

    const timeLinePosts = [];

    for (const post of currentUserPosts) {
      const authorData = await UserModel.findOne(
        {
          _id: new mongoose.Types.ObjectId(post.userId),
        },
        "_id profilePicture followers"
      );

      const completeInfoPost = {
        ...post._doc,
        authorData,
      };
      timeLinePosts.push(completeInfoPost);
    }

    const foundedFollowingPosts = followingPosts[0].followingPosts.filter(
      (post) => post.visibility
    );
    for (const post of foundedFollowingPosts) {
      const authorData = await UserModel.findOne(
        {
          _id: new mongoose.Types.ObjectId(post.userId),
        },
        "_id profilePicture followers"
      );

      const completeInfoPost = {
        ...post,
        authorData,
      };
      timeLinePosts.push(completeInfoPost);
    }

    res
      .status(200)
      .json(
        timeLinePosts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      );

    // res
    //   .status(200)
    //   .json(
    //     currentUserPosts
    //       .concat(
    //         ...followingPosts[0].followingPosts.filter(
    //           (post) => post.visibility
    //         )
    //       )
    //       .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    //   );
  } catch (error) {
    res.status(500).json(error);
  }
};
