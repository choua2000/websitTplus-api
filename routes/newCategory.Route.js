import express from 'express';
const router = express.Router();
import { Auth } from '../middlewares/auth.guard';
import can from '../middlewares/canAccess';
import permiss from '../libs/auth/permissions';
import {
    createNewsCategory,
    updateNewsCategory,
    findNewsCategory,
    findOneNewsCategory,
    deleteNewsCategory,
} from '../controllers/newCategory.Contrller';

router
    .route('/news-Category')
    .post(Auth, can(permiss.CREATE_NEW_CATEGORY), createNewsCategory)
    .get(findNewsCategory)

router
    .route('/news-Category/:id')
    .put(Auth, can(permiss.UPDATE_NEW_CATEGORY), updateNewsCategory)
    .delete(Auth, can(permiss.DELETE_NEW_CATEGORY),deleteNewsCategory)
    .get(findOneNewsCategory)


export default router;