import express from "express";
import { createPost, deletePost, getPost, getSavedPost, getTimelinePost, getUserPosts, hidePost, likePost, savePost, updatePost } from "../Controllers/PostController.js";

const router = express.Router();

router.post("/", createPost);
router.get("/:id", getPost);
router.put("/:id", updatePost);
router.put("/:id/delete", deletePost);
router.put("/:id/like", likePost);
router.put("/:id/save", savePost);
router.get("/:id/get_saved", getSavedPost);
router.put("/:id/hide", hidePost);
router.post("/:id/profile", getUserPosts);
router.get("/:id/timeline", getTimelinePost);

export default router;
