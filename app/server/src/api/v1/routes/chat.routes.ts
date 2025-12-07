import { Router } from "express";
import { auth } from "../../../middlewares/auth.middleware";
import * as chatController from "../controllers/chat.controller";
import * as messageController from "../controllers/message.controller";

const router = Router();

router.post("/", auth, chatController.createChat);
router.get("/", auth, chatController.getMyChats);
router.get("/:id", auth, chatController.getChatById);

router.post("/:chatId/message", auth, messageController.sendMessage);
router.get("/:chatId/messages", auth, messageController.getMessages);

router.post("/:chatId/mute", auth, chatController.muteChat);
router.post("/:chatId/pin", auth, chatController.pinChat);
router.post("/group", auth, chatController.createGroupChat);


router.post("/:chatId/add-members", auth, chatController.addMembersToGroup);
router.post("/:chatId/remove-member", auth, chatController.removeMemberFromGroup);
router.post("/:chatId/leave", auth, chatController.leaveGroup);
router.delete("/:chatId/delete", auth, chatController.deleteGroupChat);


export default router;
