import express from 'express';
const router = express.Router();
import { Auth } from '../middlewares/auth.guard';
import can from '../middlewares/canAccess';
import permiss from '../libs/auth/permissions';

import {
    findOneSiteInfo,
    findSiteInfo,
    updateSiteInfo
} from '../controllers/siteInfo.Controller';
import { uploadSiteInfoImage as uploader } from '../middlewares/uploader';

router
    .route('/siteInfo')
    .get(findSiteInfo)

router
    .route('/siteInfo/:id')
    .get(findOneSiteInfo)
    .put(Auth, can(permiss.UPDATE_SITE_INFO), uploader.any("avatar", "avatar_EN"), updateSiteInfo)

export default router;