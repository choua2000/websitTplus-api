import express from 'express';
const router = express.Router();
import { Auth } from '../middlewares/auth.guard';
import can from '../middlewares/canAccess';
import permiss from '../libs/auth/permissions';

import {
    createProduct,
    updateProduct,
    findProduct,
    findOneProduct,
    deleteProduct,
    findProductBySlug
} from '../controllers/production.Controller';
import { uploadProductImage as uploader } from '../middlewares/uploader';

router
    .route('/products')
    .post(Auth, can(permiss.CREATE_PRODUCTION), uploader.any("avatar"), createProduct)
    .get(findProduct)

router
    .route('/products/:id')
    .get(findOneProduct)
    .put(Auth, can(permiss.UPDATE_PRODUCTION), uploader.any("avatar"), updateProduct)
    .delete(Auth, can(permiss.DELETE_PRODUCTION), deleteProduct)

router.get('/products/slug/:id', Auth, can(permiss.VIEW_PRODUCTION), findProductBySlug);

export default router;