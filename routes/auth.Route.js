import express from 'express'
const router = express.Router();

import {
    signUpCustomer,
    signInCustomer,
    signUpAdmin,
    signInAdmin,
    verifyCustomer,
    forGotPassword,
    reSetPassword,
    refreshJWT,
    generateUser,
} from '../controllers/auth.Controller';

router.post('/user/register', signUpCustomer);
router.post('/admin/register', signUpAdmin);
router.post('/customer/login', signInCustomer);
router.post('/admin/login', signInAdmin);
router.post('/customer/verification', verifyCustomer);
router.post('/forgot-password', forGotPassword);
router.post('/reset-password', reSetPassword);
router.post('/refresh-token', refreshJWT);
router.post('/generate-user', generateUser);

export default router;