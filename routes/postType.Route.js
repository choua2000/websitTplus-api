import express from 'express';
const router = express.Router();
import { Auth } from '../middlewares/auth.guard';
import can from '../middlewares/canAccess';
import permiss from '../libs/auth/permissions';

import {
    createPostType,
    findPostType_Ad,
    findPostType_Cli,
    findOnePostType,
    updatePostType,
    // updatePriorty,
    deletePostType,
    findPostTypeByslug,
    findPostTypePriority,
    findPostTypePriorities
} from '../controllers/postType.Contrroller';

router
    .route('/postTypes')
    .post(Auth, can(permiss.CREATE_POST_TYPE), createPostType)
    .get(Auth, can(permiss.VIEW_POST_TYPE), findPostType_Ad)

router
    .route('/postTypes/:id')
    .get(Auth, can(permiss.VIEW_POST_TYPE), findOnePostType)
    .put(Auth, can(permiss.UPDATE_POST_TYPE), updatePostType)
    .delete(Auth, can(permiss.DELETE_POST_TYPE), deletePostType)

router
    .route('/postTypes-cli')
    .get(findPostType_Cli)

// router.
//     route('/postTypes-priorities')
//     // .post(Auth, can(permiss.UPDATE_TOPPING), updatePriorty)
//     .get(findPostTypePriority)

// router.get('/postTypes-top-priorities', findPostTypePriorities);

router.get('/postTypes/slug/:id', findPostTypeByslug);

export default router;