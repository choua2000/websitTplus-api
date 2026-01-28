import express from 'express';
const router = express.Router();
import { homePage, search } from '../controllers/home.Controller';

router
    .route('/home')
    .get(homePage);

router
    .route('/search')
    .get(search);

export default router;