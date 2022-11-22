import express from "express";
import { getUser, getAllUsers, updateUser, deleteUser, followUser, unFollowUser, getSearchResults } from '../Controllers/UserController.js';
import authMiddleWare from '../MiddleWare/authMiddleWare.js';

const router = express.Router();

router.post("/", getAllUsers)
router.get("/:id", getUser);
router.put("/:id", authMiddleWare, updateUser);
router.delete("/:id", authMiddleWare, deleteUser);
router.put("/:id/follow", authMiddleWare, followUser);
router.put("/:id/unfollow", authMiddleWare, unFollowUser);
router.get("/:id/explore", getSearchResults);

export default router;