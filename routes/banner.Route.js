import express from 'express';
const router = express.Router();
import { Auth } from '../middlewares/auth.guard';
import can from '../middlewares/canAccess';
import permiss from '../libs/auth/permissions';

import {
    createBan,
    updateBan,
    updateOrderBan,
    findByOrderBan,
    findBan,
    findOneBan,
    deleteBan
} from '../controllers/banner.Controller';
import { uploadBanImage as uploader } from '../middlewares/uploader';

router
    .route('/banner')
    .post(Auth, can(permiss.CREATE_BANNER), uploader.any("avatar", "avatar_EN"), createBan)
    .get(findBan)

router
    .route('/banner/:id')
    .put(Auth, can(permiss.UPDATE_BANNER), uploader.any("avatar", "avatar_EN"), updateBan)
    .get(findOneBan)
    .delete(Auth, can(permiss.DELETE_BANNER), deleteBan)

router
    .route('/banner-order')
    .post(Auth, can(permiss.UPDATE_BANNER), updateOrderBan)
    .get(findByOrderBan)

export default router;