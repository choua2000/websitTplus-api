import express from 'express'
const router = express.Router();
import can from '../middlewares/canAccess'
import permiss from '../libs/auth/permissions';
import { Auth } from '../middlewares/auth.guard'
// import { permissionAll } from '../libs/auth/permissions'

import {
    createRole,
    updateRole,
    findRole,
    findOneRole,
    deleteRole,
    addRolesPermission,
    findRolePermissions,
    deleteRolesPermission
} from '../controllers/role.Controller'

// let pm = ['manage-role-permissions', 'view-admin-dashboard']

router
    .route('/roles')
    .post(Auth, can(permiss.CREATE_ROLES), createRole)
    .get(Auth, can(permiss.VIEW_ROLES), findRole)
    // .get( findRole)

router
    .route('/roles/:id')
    .put(Auth, can(permiss.UPDATE_ROLES), updateRole)
    .get(Auth, can(permiss.VIEW_ROLES), findOneRole)
    .delete(Auth, can(permiss.DELETE_ROLES), deleteRole)

router
    .route('/roles/:id/permissions')
    .post(Auth, can(permiss.ADD_ROLE_PERMISSIONS), addRolesPermission)
    .get(Auth, can(permiss.VIEW_ROLE_PERMISSIONS), findRolePermissions)

router.delete('/roles/:role_id/permissions/:perm_id', Auth, can(permiss.DELETE_ROLE_PERMISSIONS),deleteRolesPermission);

export default router;