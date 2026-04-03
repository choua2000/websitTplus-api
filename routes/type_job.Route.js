import express from 'express';
import { createTypeJob, findAllTypeJob, deleteTypeJob } from '../controllers/type_job.controller';

const router = express.Router();

router.post('/create-type-job', createTypeJob);

router.get('/find-all-type-job', findAllTypeJob);

router.delete('/delete-type-job/:id', deleteTypeJob);

export default router;