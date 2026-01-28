import express from 'express'
const router = express.Router();
import { Auth } from '../middlewares/auth.guard';
import can from '../middlewares/canAccess';
import permiss from '../libs/auth/permissions';
import {
    create,
    find,
    findOne,
    update,
    deleteTitle
} from '../controllers/titleContact.Controller';

router
    .route('/titleContacts')
    .post(Auth, can(permiss.CREATE_TITLE_CONTACT), create)
    .get(find)

router
    .route('/titleContacts/:id')
    .get(findOne)
    .put(Auth, can(permiss.UPDATE_TITLE_CONTACT), update)
    .delete(Auth, can(permiss.DELETE_TITLE_CONTACT), deleteTitle)


export default router;