'use strict';
import { hashPassword } from '../libs/utils/security';
import { Users, Roles, Permissions, Employees } from '../models';
import Role from '../libs/auth/roles';
import Permission from '../libs/auth/permissions';

// const { Users, Roles, Permissions } = model;

export default {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    let rolesArray = []
    for (let [key, value] of Object.entries(Role)) {
      rolesArray.push({ name: value });
    }

    await Roles.bulkCreate(rolesArray);

    let permissionsArray = []
    for (let [key, value] of Object.entries(Permission)) {
      permissionsArray.push({ name: value });
    }

    await Permissions.bulkCreate(permissionsArray);

    const superAdminUser = await Users.create({
      id: 1,
      username: 'Oska',
      email: 'tpluslao@gmail.com',
      phone: '2077779999',
      password: hashPassword('super@dminTplus2020'),
      status: 'active',
      // createdAt: new Date(),
      // updatedAt: new Date()
    });
    await Employees.create({
      userId: 1,
      firtName: 'Super Admin',
      surName: 'SuperAdminTplus',
    });
    // await superAdminUser.addEmployees({
    //   firtName: 'Super Admin',
    //   surname: 'SuperAdminTplus',
    // })


    const superAdminRole = await Roles.findOne({ where: { name: Role.SUPER_ADMIN } });
    const superAdminPermissions = await Permissions.findAll({
      where: {
        name: [
          // -------> user <---------
          Permission.CREATE_USER,
          Permission.UPDATE_USER,
          Permission.DELETE_USER,
          Permission.VIEW_USER,
          Permission.VIEW_ALL_USERS,

          // -------> permiss <---------
          Permission.VIEW_PERMISSIONS,
          Permission.CREATE_PERMISSIONS,
          Permission.UPDATE_PERMISSIONS,
          Permission.DELETE_PERMISSIONS,
          Permission.MANAGE_PERMISSIONS,
          Permission.MANAGE_ROLE_PERMISSIONS,

          // -------> role <---------
          Permission.VIEW_ROLES,
          Permission.CREATE_ROLES,
          Permission.UPDATE_ROLES,
          Permission.DELETE_ROLES,
          Permission.MANAGE_ROLES,
          Permission.ADD_ROLE_PERMISSIONS,
          Permission.VIEW_ROLE_PERMISSIONS,

          // ---------> manage user role permiss <----------
          Permission.ADD_USER_ROLE,
          Permission.DELETE_USER_ROLE,
          Permission.ADD_USER_PERMISSIONS,
          Permission.DELETE_USER_PERMISSIONS,

          // -------> product <---------
          Permission.CREATE_CATEGORY_PRODUCTS,
          Permission.UPDATE_CATEGORY_PRODUCTS,
          Permission.DELETE_CATEGORY_PRODUCTS,
          Permission.VIEW_CATEGORY_PRODUCTS,

          // -------> package <---------
          Permission.CREATE_CATEGORY_PACKAGE,
          Permission.UPDATE_CATEGORY_PACKAGE,
          Permission.DELETE_CATEGORY_PACKAGE,
          Permission.VIEW_CATEGORY_PACKAGE,
          Permission.ADD_PACKAGE_SIM_TYPE,
          Permission.DELETE_PACKAGE_SIM_TYPE,

          // -------> posttype <---------
          Permission.CREATE_POST_TYPE,
          Permission.UPDATE_POST_TYPE,
          Permission.DELETE_POST_TYPE,
          Permission.VIEW_POST_TYPE,

          // -------> post <---------
          Permission.CREATE_POST,
          Permission.UPDATE_POST,
          Permission.DELETE_POST,
          Permission.VIEW_POST,

          // -------> package <---------
          Permission.CREATE_PACKAGE,
          Permission.UPDATE_PACKAGE,
          Permission.DELETE_PACKAGE,
          Permission.VIEW_PACKAGE,

          // -------> production <---------
          Permission.CREATE_PRODUCTION,
          Permission.UPDATE_PRODUCTION,
          Permission.DELETE_PRODUCTION,
          Permission.VIEW_PRODUCTION,

          // -------> position <---------
          Permission.CREATE_POSITION,
          Permission.UPDATE_POSITION,
          Permission.DELETE_POSITION,
          Permission.VIEW_POSITION,

          // -------> banner <---------  
          Permission.CREATE_BANNER,
          Permission.UPDATE_BANNER,
          Permission.DELETE_BANNER,
          Permission.VIEW_BANNER,

          // -------> contact <---------   
          Permission.CREATE_TITLE_CONTACT,
          Permission.UPDATE_TITLE_CONTACT,
          Permission.DELETE_TITLE_CONTACT,
          Permission.VIEW_CONTACT,
          Permission.DELETE_CONTACT,

          // --------> InternationalCall <---------
          Permission.CREATE_INTERNATION_CALL,
          Permission.UPDATE_INTERNATION_CALL,
          Permission.DELETE_INTERNATION_CALL,

          // -------> jebrecuit <---------  
          Permission.VIEW_JOBRECUIT,
          Permission.DELETE_JOBRECUIT,

          // -------> siteInfo <--------- 
          Permission.UPDATE_SITE_INFO,

          // -------> topping <--------- 
          Permission.UPDATE_TOPPING,

          // -------> chat Question <--------
          Permission.CREATE_QUESTION,
          Permission.UPDATE_QUESTION,
          Permission.DELETE_QUESTION,

          // ------> reply user <------------
          Permission.SEND_MESSAGE,

          //----> view chat room <-------
          Permission.VIEW_CHAT_ROOM,

          // -------> new category <--------- 
          Permission.CREATE_NEW_CATEGORY,
          Permission.UPDATE_NEW_CATEGORY,
          Permission.DELETE_NEW_CATEGORY,

          // -------> sim type <---------  
          Permission.CREATE_SIM_TYPE,
          Permission.UPDATE_SIM_TYPE,
          Permission.DELETE_SIM_TYPE,
          Permission.ADD_SIM_TYPE_PACKAGE,
          Permission.DELETE_PACKAGE_SIM_TYPE,



        ]
      }
    });
    await superAdminUser.addRoles(superAdminRole);
    await superAdminRole.addPermissions(superAdminPermissions);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await Roles.destroy();
    await Permissions.destroy();
    await Users.destroy();
  }
};
