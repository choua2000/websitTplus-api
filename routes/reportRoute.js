import express from "express";
const router = express.Router();

import { 
    reportUsers,
    reportPackages,
    reportNewsBetweenDate,
    reportTopUp,
 } from "../controllers/reportController";

router.get('/report-users', reportUsers);
router.get('/report-packages', reportPackages);
router.get('/report-news', reportNewsBetweenDate);
router.get('/report-TopUp', reportTopUp);


export default router;