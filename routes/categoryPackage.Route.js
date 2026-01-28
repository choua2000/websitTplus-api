import express from 'express';
const router = express.Router();
import {
    findAllCategory,
    findOneCategory
} from '../controllers/categoryPackage.Controller';

router
    .route('/category-Package')
    .get(findAllCategory)

router
    .route('/category-Package/:id')
    .get(findOneCategory)


export default router;