import express from "express";
import { createNotification, deleteNotification, getNotifications } from "../Controllers/NotificationController.js";

const router = express.Router();

router.post("/", createNotification);
router.get("/:id", getNotifications);
router.put("/delete", deleteNotification);

export default router;