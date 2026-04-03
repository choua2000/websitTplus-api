import express from "express";
import { Auth } from "../middlewares/auth.guard";
import can from "../middlewares/canAccess";
import { uploadFileJob as uploader } from "../middlewares/uploader";
import { createJobApplication, changeStatusApplication, findJobApplication, findJobApplicationById, findPendingApplications, findApprovedApplications, findRejectedApplications } from "../controllers/job_application.controller";

const router = express.Router();

router.post("/create-job-application", uploader.any("images"), createJobApplication);
router.get("/find-job-application", findJobApplication);
router.get("/find-job-application-by-id/:id", findJobApplicationById);
router.get('/find-pending-applications', findPendingApplications);
router.get('/find-approved-rejected-applications', findRejectedApplications);
router.put('/change-status/:id', changeStatusApplication);
export default router; 