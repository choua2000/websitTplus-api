import express from 'express';
const router = express.Router();
import { Auth } from '../middlewares/auth.guard';
import can from '../middlewares/canAccess';
import permiss from '../libs/auth/permissions';

import {
    createPost,
    updatePost,
    findPost,
    findPost_Cli,
    findOnePost,
    findPostBySlug,
    findPostStatus,
    findPostByTypeAndStatus,
    deletePost,
    findAllPostNews,
    findAllPostPromotions,
    findAllEvent,
    findAllPostNews_cli,
    findAllPostPromotions_cli,
    findAllEvent_cli,
    findPostNew_Limit,
    reportPromotion,
    reportPromotionBetweenDate,
    reportActivities,
    reportActivitiesBetweenDate
} from '../controllers/post.Controller';
import { uploadPostImage as uploader } from '../middlewares/uploader';

router
    .route('/posts')
    .post(Auth, can(permiss.CREATE_POST), uploader.any("avatar", "avatar_EN"), createPost)
    // .post(createPost)
    .get(findPost)

router
    .route('/posts/:id')
    .get(Auth, can(permiss.VIEW_POST), findOnePost)
    .put(Auth, can(permiss.UPDATE_POST), uploader.any("avatar", "avatar_EN"), updatePost)
    .delete(Auth, can(permiss.DELETE_POST), deletePost)

router
    .route('/posts-cli')
    .get(findPost_Cli)

router.get('/posts-status', findPostStatus);
router.get('/posts/slug/:id', findPostBySlug);
router.get('/posts-type-stt/:id', findPostByTypeAndStatus);

// router.get('/posts-news', findAllPostNews || '/posts-promotion', findAllPostPromotions)

router
    .route('/posts-news')
    .get(Auth, can(permiss.VIEW_POST), findAllPostNews)

router
    .route('/posts-promotion')
    .get(Auth, can(permiss.VIEW_POST), findAllPostPromotions)

router
    .route('/posts-event')
    .get(Auth, can(permiss.VIEW_POST), findAllEvent)

router
    .route('/posts-news-cli')
    .get(findAllPostNews_cli)

router
    .route('/posts-news-cli-limit')
    .get(findPostNew_Limit)

router
    .route('/posts-promotion-cli')
    .get(findAllPostPromotions_cli)

router
    .route('/posts-event-cli')
    .get(findAllEvent_cli)

router.get('/report-promotion', reportPromotion);

router.get('/report-between-promotion', reportPromotionBetweenDate);

router.get('/report-activities', reportActivities);

router.get('/report-between-activities', reportActivitiesBetweenDate);

export default router;