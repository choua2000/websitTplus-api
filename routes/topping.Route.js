import express from 'express';
const router = express.Router();
import { Auth } from '../middlewares/auth.guard';
import can from '../middlewares/canAccess';
import permiss from '../libs/auth/permissions';
import {
    updateTopping,
    findPriority
} from '../controllers/topping.Controller';

router
    .route('/topping-edit')
    .post(Auth, can(permiss.UPDATE_TOPPING), updateTopping)

router
    .route('/topping-show')
    .get(findPriority)

export default router;