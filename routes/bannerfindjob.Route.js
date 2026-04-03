import express from 'express';
const router = express.Router();
import { getBannerFindjob, createBannerFindjob } from '../controllers/bannerfindjob.controller';

router.get('/banner-findjob', getBannerFindjob);
router.post('/banner-findjob', createBannerFindjob);

export default router;