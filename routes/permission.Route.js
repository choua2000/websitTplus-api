import express from 'express';
const router = express.Router();
import { Auth } from '../middlewares/auth.guard';
import can from '../middlewares/canAccess';
import permiss from '../libs/auth/permissions'

import {
    createPermission,
    updatePermission,
    findOnePermission,
    findPermission,
    deletePermission
} from '../controllers/permission.Controller'

router
    .route('/permissions')
    .post(Auth, can(permiss.CREATE_PERMISSIONS), createPermission)
    .get(Auth, can(permiss.VIEW_PERMISSIONS), findPermission)

router
    .route('/permissions/:id')
    .put(Auth, can(permiss.UPDATE_PERMISSIONS), updatePermission)
    .get(Auth, can(permiss.VIEW_PERMISSIONS), findOnePermission)
    .delete(Auth, can(permiss.DELETE_PERMISSIONS), deletePermission)

module.exports = router;