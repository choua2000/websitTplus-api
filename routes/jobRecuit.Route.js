import express from 'express';
const router = express.Router();
import { Auth } from '../middlewares/auth.guard';
import can from '../middlewares/canAccess';
import permiss from '../libs/auth/permissions';
import { uploadFileJob as uploader } from '../middlewares/uploader';

import {
    createJobRecuit,
    findJobRecuit,
    findOneJobRecuit,
    deleteJobRecuit
} from '../controllers/jobRecuit.Controller';

router
    .route('/jobRecuit')
    .post(uploader.any("avatar"), createJobRecuit)
    .get(Auth, can(permiss.VIEW_JOBRECUIT), findJobRecuit)

router
    .route('/jobRecuit/:id')
    .get(Auth, can(permiss.VIEW_JOBRECUIT), findOneJobRecuit)
    .delete(Auth, can(permiss.DELETE_JOBRECUIT), deleteJobRecuit)

export default router;