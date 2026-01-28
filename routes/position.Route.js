import express from 'express';
const router = express.Router();
import { Auth } from '../middlewares/auth.guard';
import can from '../middlewares/canAccess';
import permiss from '../libs/auth/permissions';

import {
    createPosition,
    updatePosition,
    findPosition,
    findOnePosition,
    deletePosition
} from '../controllers/position.Controller';

router
    .route('/position')
    .post(Auth, can(permiss.CREATE_POSITION), createPosition)
    .get(Auth, can(permiss.VIEW_POSITION), findPosition)

router
    .route('/position/:id')
    .put(Auth, can(permiss.UPDATE_POSITION), updatePosition)
    .get(Auth, can(permiss.VIEW_POSITION), findOnePosition)
    .delete(Auth, can(permiss.DELETE_POSITION), deletePosition)

export default router;