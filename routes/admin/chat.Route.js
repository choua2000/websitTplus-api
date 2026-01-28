import express from "express";
const router = express.Router();
import can from '../../middlewares/canAccess';
import permiss from '../../libs/auth/permissions';
import { Auth } from '../../middlewares/auth.guard';
import {
    allChatRooms,
    getChatRoom,
    leaveRoom,
    sendMessage
} from "../../controllers/admin/adminChat.Controller"

router
    .route("/chat")
    .get(Auth, can(permiss.VIEW_CHAT_ROOM), allChatRooms);

router.route("/chat/:id")
    .get(Auth, can(permiss.VIEW_CHAT_ROOM), getChatRoom);

router.route("/chat/leave").post(Auth, leaveRoom);

router.route("/chat/:id").post(Auth, can(permiss.SEND_MESSAGE), sendMessage);

export default router;