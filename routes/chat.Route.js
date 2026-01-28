import express from 'express';
const router = express.Router();
import { Auth } from '../middlewares/auth.guard';


import {
    sendMessage,
    loadChatRoom
} from '../controllers/chat.Controller';

router
  .route('/chat')
  .get(Auth,loadChatRoom);

router
  .route('/chat')
  .post(Auth,sendMessage);



export default router;
