import express from 'express';
const router = express.Router();
import { Auth } from '../middlewares/auth.guard';
import can from '../middlewares/canAccess';
import permiss from '../libs/auth/permissions';
// call zone and internationCall controllers
import {
    createZone,
    updateZone,
    findOneZone,
    findZone,
    deleteZone,
    create_InternationalCall,
    update_InternationalCall,
    find_InternationalCall,
    findOne_InternationalCall,
    delete_InternationalCall,
} from '../controllers/internationCall.Controller';

router
    .route('/zones')
    .get(findZone)
    .post(Auth, can(permiss.CREATE_INTERNATION_CALL), createZone)

router
    .route('/zones/:id')
    .get(findOneZone)
    .put(Auth, can(permiss.UPDATE_INTERNATION_CALL), updateZone)
    .delete(Auth, can(permiss.DELETE_INTERNATION_CALL), deleteZone)


router
    .route('/internationCalls')
    .get(find_InternationalCall)
    .post(Auth, can(permiss.CREATE_INTERNATION_CALL), create_InternationalCall)

router
    .route('/internationCalls/:id')
    .get(findOne_InternationalCall)
    .put(Auth, can(permiss.UPDATE_INTERNATION_CALL), update_InternationalCall)
    .delete(Auth, can(permiss.DELETE_INTERNATION_CALL), delete_InternationalCall)

export default router;