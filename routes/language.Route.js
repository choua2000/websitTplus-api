import express from 'express';
const router = express.Router();

import {
    findLanguage,
    findOneLanguage
} from '../controllers/language.Controller';

router
    .route('/language')
    .get(findLanguage)

router
    .route('/language/:id')
    .get(findOneLanguage)

export default router;