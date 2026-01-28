import express from 'express';
const router = express.Router();
import { Auth } from '../middlewares/auth.guard';
import can from '../middlewares/canAccess';
import permiss from '../libs/auth/permissions';

import {
    createContact,
    findContact,
    findOneContact,
    deleteContact
} from '../controllers/contact.Controller';

router
    .route('/contact')
    .post(createContact)
    .get(Auth, can(permiss.VIEW_CONTACT), findContact)

router
    .route('/contact/:id')
    .get(Auth, can(permiss.VIEW_CONTACT), findOneContact)
    .delete(Auth, can(permiss.DELETE_CONTACT), deleteContact)

export default router;