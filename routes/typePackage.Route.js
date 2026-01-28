import express from 'express';
const router = express.Router();
import { Auth } from '../middlewares/auth.guard';
import can from '../middlewares/canAccess';
import permiss from '../libs/auth/permissions';
import {
    findTypePackages,
    findOneTypePackages,
    updateTypePackage,
} from '../controllers/typePackage.Controller';
import { uploadTypePackageImage as uploader } from '../middlewares/uploader';

router
    .route('/typePackages')
    .get(findTypePackages)

router
    .route('/typePackages/:id')
    .get(findOneTypePackages)
    .put(Auth, can(permiss.UPDATE_PACKAGE), uploader.any("avatar", "avatar_EN"), updateTypePackage)


export default router;