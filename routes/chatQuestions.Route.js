import express from 'express';
const router = express.Router();
import { Auth } from '../middlewares/auth.guard';
import can from '../middlewares/canAccess';
import permiss from '../libs/auth/permissions';

import {
  storeQuestion,
  updateQuestion,
  getQuestion,
  getAllQuestion,
  destroyQuestion,
  createAndAddSubQuestion,
  loadBaseQuestion,
  addExistingQuestionToSubQuestion,
  viewSubQuestion
} from '../controllers/chatQuestion.Controller';


router
  .route('/question')
  .get(Auth, getAllQuestion);

router
  .route('/question/:id')
  .get(Auth, getQuestion);

router
  .route('/question')
  .post(Auth, can(permiss.CREATE_QUESTION), storeQuestion);

router.route("/question/:id")
  .put(Auth, can(permiss.UPDATE_QUESTION), updateQuestion);

router.route("/question/:id/newSub")
  .post(Auth, can(permiss.CREATE_QUESTION), createAndAddSubQuestion);

router.route("/question/:id/sub")
  .post(Auth, can(permiss.UPDATE_QUESTION), addExistingQuestionToSubQuestion);

router.route("/baseQuestion/")
  .get(Auth, loadBaseQuestion);
router.route("/baseQuestion/:id/sub")
  .get(Auth, viewSubQuestion);

router.delete('/question/:id', Auth, can(permiss.DELETE_QUESTION), destroyQuestion);

export default router;

