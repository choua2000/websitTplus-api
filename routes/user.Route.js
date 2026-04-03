import express from 'express';
const router = express.Router();
import { Auth } from '../middlewares/auth.guard';
import can from '../middlewares/canAccess';
import permiss from '../libs/auth/permissions';

import {
  findUsers,
  findAllUserCustomer,
  findOneUser,
  findOneUserRolesPermiss,
  findUserhasRole,
  findUserhasPermiss,
  updateUserAd,
  updateUser_Cli,
  addUserRole,
  deleteUserRole,
  addUserPermissions,
  deleteUserPermissions,
  reportAllUsers,
  reportAllCustomer,
  reportAllEmployees,
  reportUserGenerate,
} from '../controllers/user.Controller';

router
  .route('/users')
  .get(Auth, can(permiss.VIEW_ALL_USERS), findUsers)

router.get('/users-customers', findAllUserCustomer);

router.get('/user', Auth, findOneUser);

router
  .route('/users/:id')
  .put(Auth, can(permiss.UPDATE_USER), updateUserAd)

router
  .route('/user-customers/:id')
  .put(Auth, can(permiss.UPDATE_USER), updateUser_Cli)

// .get(Auth, can(permiss.VIEW_USER), findOneUserRolesPermiss);

router
  .route('/users/:id/Roles')
  .post(Auth, can(permiss.ADD_USER_ROLE), addUserRole)

router.get('/users-roles/:id/', Auth, can(permiss.VIEW_USER), findUserhasRole);
router.get('/users-permissions/:id/', Auth, can(permiss.VIEW_USER), findUserhasPermiss);
router.get('/users-roles-permissions/:id/', Auth, can(permiss.VIEW_USER), findOneUserRolesPermiss);

router.delete('/users/:user_id/roles/:role_id', Auth, can(permiss.DELETE_USER_ROLE), deleteUserRole);
router.post('/users/:id/permissions', Auth, can(permiss.ADD_USER_PERMISSIONS), addUserPermissions);
router.delete('/users/:user_id/permissions/:perm_id', Auth, can(permiss.DELETE_USER_PERMISSIONS), deleteUserPermissions);

// ----------> report <---------
router.get('/report-users-all', reportAllUsers);

router.get('/report-users-all/customer', reportAllCustomer);

router.get('/report-users-all/employees', reportAllEmployees);

router.get('/report-users-all/generate', reportUserGenerate);

export default router; 
