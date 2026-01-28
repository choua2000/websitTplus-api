import express from 'express';
const router = express.Router();
import { Auth } from '../middlewares/auth.guard';
import can from '../middlewares/canAccess';
import permiss from '../libs/auth/permissions';
import {
    createSimType,
    findSimType,
    updateSimType,
    deleteSimType,
    addSimTypePackage,
    findSimTypeHasPackages,
    deleteSimTypePackage,
} from '../controllers/simType.Controller';

router
    .route('/sim-Types')
    .post(Auth, can(permiss.CREATE_SIM_TYPE), createSimType)
    .get(findSimType)

router
    .route('/sim-Types/:id')
    .put(Auth, can(permiss.UPDATE_SIM_TYPE), updateSimType)
    .delete(Auth, can(permiss.DELETE_SIM_TYPE), deleteSimType)

router
    .route('/simType/:id/packages')
    .post(Auth, can(permiss.ADD_SIM_TYPE_PACKAGE), addSimTypePackage)
    .get(findSimTypeHasPackages)

router.delete('/simType/:simType_id/package/:package_id', Auth, can(permiss.DELETE_SIM_TYPE_PACKAGE), deleteSimTypePackage);


export default router;