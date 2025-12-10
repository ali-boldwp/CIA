import express from "express";
import { auth } from "../../../middlewares/auth.middleware";
import * as notifController from "../controllers/notification.controller";

const router = express.Router();

router.post("/", auth, notifController.create);
router.get("/", auth, notifController.getAll);
router.get("/unseen", auth, notifController.unseenCount);
router.put("/seen/:id", auth, notifController.markAsSeen);
router.put("/seen-all", auth, notifController.markAllAsSeen);

export default router;
