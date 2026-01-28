import express from 'express';
const router = express.Router();
import { Auth } from '../middlewares/auth.guard';
import can from '../middlewares/canAccess';
import permiss from '../libs/auth/permissions';
import { uploadPackageImage as uploader } from '../middlewares/uploader';
import {
    createPackage,
    updatePackage,
    updatePriorityPackage,
    findPackage,
    findOnePackage,
    findOnePackageBySlug,
    findPackageByType,
    findPackageByTypeAndPriority,
    searchPackageBeforeLogin,
    searchPackageAfterLogin,
    findPackageByCategory,
    deletePackage,
    addPackageSimType,
    findPackageHasSimTypes,
    deletePackageSimType,
    topUpCard,
    registerPackge,
    listPackageSimTypes,
    listPackageSimTypesAfterLogin_Home,
    transferBalance,
} from '../controllers/package.Controller';

router
    .route('/packages')
    .post(Auth, can(permiss.CREATE_PACKAGE), uploader.any("avatar"), createPackage)
    .get(findPackage)

router
    .route('/packages/:id')
    .put(Auth, can(permiss.UPDATE_PACKAGE), uploader.any("avatar"), updatePackage)
    .delete(Auth, can(permiss.DELETE_PACKAGE), deletePackage)
    .get(findOnePackage)

// search packages before login
router
    .route('/search-packages-public')
    .get(searchPackageBeforeLogin)

// search packages after login
router
    .route('/search-packages-in-login')
    .get(Auth, searchPackageAfterLogin)

// update priority package
router
    .route('/packages-priority/:typePackage_id')
    .put(Auth, can(permiss.UPDATE_PACKAGE), updatePriorityPackage)
    .get(findPackageByTypeAndPriority)

// get one package by slug
router
    .route('/packages-slug/:slug')
    .get(findOnePackageBySlug)

router
    .route('/packages-type/:id')
    .get(findPackageByType)

router
    .route('/packages-type/:type_id/category/:cate_id')
    .get(findPackageByCategory)

router
    .route('/packages/:id/simTypes')
    .post(Auth, can(permiss.ADD_PACKAGE_SIM_TYPE), addPackageSimType)

router
    .route('/packages/:package_id/simTypes/:simType_id')
    .delete(Auth, can(permiss.DELETE_PACKAGE_SIM_TYPE), deletePackageSimType)

router.get('/packages-simTypes/:id', findPackageHasSimTypes);

router.post('/packages-refill-card', Auth, topUpCard);

router.post('/packages-register', Auth, registerPackge);

router.get('/packages-list-category/:cate_id', Auth, listPackageSimTypes);

router.get('/packages-list-home', Auth, listPackageSimTypesAfterLogin_Home);

router.post('/transfer-balance', Auth, transferBalance);

export default router;