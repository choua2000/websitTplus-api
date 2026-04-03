
import express from 'express';
const router = express.Router();
import { createJob, findAllJob, updateJob, findJobById, deleteJob, getIsActive } from '../controllers/job.controller';
import { Auth } from "../middlewares/auth.guard";

import { uploadFileJob as uploader } from "../middlewares/uploader";

router.post('/create-job', uploader.any(), createJob);
router.get('/get-is-active', findAllJob);
router.get('/find-job-by-id/:id', findJobById);
router.put('/update-job/:id', uploader.any(), updateJob);
router.delete('/delete-job/:id', deleteJob);
router.get('/get-all', getIsActive);



export default router;