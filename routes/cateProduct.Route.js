import express from 'express';
const router = express.Router();
import { Auth } from '../middlewares/auth.guard';
import can from '../middlewares/canAccess';
import permiss from '../libs/auth/permissions';

import {
    createCateProduct,
    findCateProduct,
    findOneCateProduct,
    updateCateProduct,
    deleteCateProduct,
    findCateProductBySlug
} from '../controllers/cateProduct.Controller';

router
    .route('/categoryProducts')
    .post(Auth, can(permiss.CREATE_CATEGORY_PRODUCTS), createCateProduct)
    .get(Auth, can(permiss.VIEW_CATEGORY_PRODUCTS), findCateProduct)

router
    .route('/categoryProducts/:id')
    .put(Auth, can(permiss.UPDATE_CATEGORY_PRODUCTS), updateCateProduct)
    .get(Auth, can(permiss.VIEW_CATEGORY_PRODUCTS), findOneCateProduct)
    .delete(Auth, can(permiss.DELETE_CATEGORY_PRODUCTS), deleteCateProduct)

router.get('/categoryProducts/slug/:id', findCateProductBySlug)

export default router;