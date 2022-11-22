import express from "express";
import { createComment, getComment, getPostComments, likePostComment } from "../Controllers/CommentController.js";

const router = express.Router();

router.post("/", createComment);
router.get("/:id", getComment);
router.get("/post-comments/:id", getPostComments);
router.put("/like/:id", likePostComment);

export default router;