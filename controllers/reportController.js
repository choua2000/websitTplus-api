import {
  Users,
  Languages,
  CatePackage,
  CatePackageTran,
  NewPackage,
  NewPackageTran,
  TypePackage,
  TypePackagTran,
  PostTypes,
  PostTypesTran,
  Post,
  PostTran,
  PostImage,
  PostImageTran,
  History,
  Roles,
  Permissions,
  UserRoles,
  Employees,
  Customer,
  UserPermissions,
  sequelize,
  Sequelize,
} from "../models";
import createError from "http-errors";
import _languages from "../constants/language";
import { Op } from "sequelize";

/**
 * It returns a list of all users in the database
 * @param req - The request object.
 * @param res - The response object.
 * @param next - This is a callback function that will be called when the middleware is done.
 * @returns A JSON object with the following properties:
 * success: true,
 * message: `Total number of system user employees: ${usersQuery.count}`,
 * data: usersQuery,
 */
export const reportUsers = async (req, res, next) => {
  if (req.query.filter == "active") {
    // filter active
    let usersQuery = await Users.findAndCountAll({
      where: { status: "active", type_user: "real_user" },
      attributes: [
        "id",
        "phone",
        "status",
        "createdAt",
        "updatedAt",
        "type_user",
      ],
      include: [{ model: Customer, required: true }],
      order: [["id", req.query.newest == "id" ? "DESC" : "ASC"]],
    });

    return res.json({
      success: true,
      message: `Total number of system user employees: ${usersQuery.count}`,
      data: usersQuery,
    });
  }

  if (req.query.filter == "inactive") {
    // filter inactive
    let usersQuery = await Users.findAndCountAll({
      where: { status: "inactive", type_user: "real_user" },
      attributes: [
        "id",
        "phone",
        "status",
        "createdAt",
        "updatedAt",
        "type_user",
      ],
      include: [{ model: Customer, required: true }],
      order: [["id", req.query.newest == "id" ? "DESC" : "ASC"]],
    });

    return res.json({
      success: true,
      message: `Total number of system user employees: ${usersQuery.count}`,
      data: usersQuery,
    });
  }

  // default query
  let usersQuery = await Users.findAndCountAll({
    where: { type_user: "real_user" },
    attributes: [
      "id",
      "phone",
      "status",
      "createdAt",
      "updatedAt",
      "type_user",
    ],
    include: [{ model: Customer, required: true }],
    order: [["id", req.query.newest == "id" ? "DESC" : "ASC"]],
  });

  return res.json({
    success: true,
    message: `Total number of system user employees: ${usersQuery.count}`,
    data: usersQuery,
  });
};

/**
 * This function is used to get all packages in a category.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function in the stack.
 */
export const reportPackages = async (req, res, next) => {
  try {
    const lang = req.query.lang || req.headers.content_language;
    const cate_id = req.query.cate_id;
    // console.log("Type ====>", typeof cate_id);

    if (lang !== undefined) {
      const language = await Languages.findOne({ where: { short: lang } });
      if (!language)
        throw createError.NotFound(
          "Languages not found just the moment. Please choose language supported now."
        );

      if (language.short === _languages.ENGLISH) {
        // Filter by Prepaid
        if (req.query.filter === "prepaid") {
          let type_id = 1;

          // Filter All Prepaid
          if (cate_id === undefined || cate_id === "0") {
            let packageType = await TypePackage.findByPk(type_id, {
              include: [
                { model: TypePackagTran },
                {
                  model: NewPackage,
                  include: [{ model: NewPackageTran }],
                },
              ],
            });

            return res.json({
              success: true,
              message: `Get data category has package successfully`,
              data: packageType,
            });
          }

          // Filter by category
          // eng
          let packageCategory = await CatePackage.findByPk(cate_id, {
            include: [
              { model: CatePackageTran },
              {
                model: NewPackage,
                where: { typePackage_Id: type_id },
                required: true,
                include: [
                  { model: NewPackageTran },
                  {
                    model: TypePackage,
                    as: "typePackage",
                    include: [{ model: TypePackagTran }],
                  },
                ],
              },
            ],
          });

          if (!packageCategory)
            throw createError.NotFound(
              `This category package ID:${cate_id}. does not exist`
            );

          return res.json({
            success: true,
            message: `Get data category has package successfully`,
            data: packageCategory,
          });
        }

        // Filter by Postpaid
        if (req.query.filter === "postpaid") {
          let type_id = 2;

          // Filter All Postpaid
          if (cate_id === undefined || cate_id === "0") {
            let packageType = await TypePackage.findByPk(type_id, {
              include: [
                { model: TypePackagTran },
                {
                  model: NewPackage,
                  include: [{ model: NewPackageTran }],
                },
              ],
            });

            return res.json({
              success: true,
              message: `Get data category has package successfully`,
              data: packageType,
            });
          }

          // Filter by category
          // eng
          let packageCategory = await CatePackage.findByPk(cate_id, {
            include: [
              { model: CatePackageTran },
              {
                model: NewPackage,
                where: { typePackage_Id: type_id },
                required: true,
                include: [
                  { model: NewPackageTran },
                  {
                    model: TypePackage,
                    as: "typePackage",
                    include: [{ model: TypePackagTran }],
                  },
                ],
              },
            ],
          });

          if (!packageCategory)
            throw createError.NotFound(
              `This category package ID:${cate_id}. does not exist`
            );

          return res.json({
            success: true,
            message: `Get data category has package successfully`,
            data: packageCategory,
          });
        }

        // Filter All Prepaid
      }

      // ---------------> Laos language <-------------
      // Filter by Prepaid
      if (req.query.filter === "prepaid") {
        let type_id = 1;

        // Filter All Prepaid
        if (cate_id === undefined || cate_id === "0") {
          let packageType = await TypePackage.findByPk(type_id, {
            include: [
              {
                model: NewPackage,
              },
            ],
          });

          return res.json({
            success: true,
            message: `Get data category has package successfully`,
            data: packageType,
          });
        }

        // Filter by category
        // eng
        let packageCategory = await CatePackage.findByPk(cate_id, {
          include: [
            {
              model: NewPackage,
              where: { typePackage_Id: type_id },
              required: true,
              include: [
                {
                  model: TypePackage,
                  as: "typePackage",
                },
              ],
            },
          ],
        });

        if (!packageCategory)
          throw createError.NotFound(
            `This category package ID:${cate_id}. does not exist`
          );

        return res.json({
          success: true,
          message: `Get data category has package successfully`,
          data: packageCategory,
        });
      }

      // Filter by Postpaid
      if (req.query.filter === "postpaid") {
        let type_id = 2;

        // Filter All Postpaid
        if (cate_id === undefined || cate_id === "0") {
          let packageType = await TypePackage.findByPk(type_id, {
            include: [
              {
                model: NewPackage,
              },
            ],
          });

          return res.json({
            success: true,
            message: `Get data category has package successfully`,
            data: packageType,
          });
        }

        // Filter by category
        // eng
        let packageCategory = await CatePackage.findByPk(cate_id, {
          include: [
            {
              model: NewPackage,
              where: { typePackage_Id: type_id },
              required: true,
              include: [
                {
                  model: TypePackage,
                  as: "typePackage",
                },
              ],
            },
          ],
        });

        if (!packageCategory)
          throw createError.NotFound(
            `This category package ID:${cate_id}. does not exist`
          );

        return res.json({
          success: true,
          message: `Get data category has package successfully`,
          data: packageCategory,
        });
      }
    } else {
      // ---------------> Default <-------------
      // Filter by Prepaid
      if (req.query.filter === "prepaid") {
        let type_id = 1;

        // Filter All Prepaid
        if (cate_id === undefined || cate_id === "0") {
          let packageType = await TypePackage.findByPk(type_id, {
            include: [
              {
                model: NewPackage,
              },
            ],
          });

          return res.json({
            success: true,
            message: `Get data category has package successfully`,
            data: packageType,
          });
        }

        // Filter by category
        // eng
        let packageCategory = await CatePackage.findByPk(cate_id, {
          include: [
            {
              model: NewPackage,
              where: { typePackage_Id: type_id },
              required: true,
              include: [
                {
                  model: TypePackage,
                  as: "typePackage",
                },
              ],
            },
          ],
        });

        if (!packageCategory)
          throw createError.NotFound(
            `This category package ID:${cate_id}. does not exist`
          );

        return res.json({
          success: true,
          message: `Get data category has package successfully`,
          data: packageCategory,
        });
      }

      // Filter by Postpaid
      if (req.query.filter === "postpaid") {
        let type_id = 2;

        // Filter All Postpaid
        if (cate_id === undefined || cate_id === "0") {
          let packageType = await TypePackage.findByPk(type_id, {
            include: [
              {
                model: NewPackage,
              },
            ],
          });

          return res.json({
            success: true,
            message: `Get data category has package successfully`,
            data: packageType,
          });
        }

        // Filter by category
        // eng
        let packageCategory = await CatePackage.findByPk(cate_id, {
          include: [
            {
              model: NewPackage,
              where: { typePackage_Id: type_id },
              required: true,
              include: [
                {
                  model: TypePackage,
                  as: "typePackage",
                },
              ],
            },
          ],
        });

        if (!packageCategory)
          throw createError.NotFound(
            `This category package ID:${cate_id}. does not exist`
          );

        return res.json({
          success: true,
          message: `Get data category has package successfully`,
          data: packageCategory,
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

export const reportNewPost = async (req, res, next) => {};

// -------------> report news between date < --------------
export const reportNewsBetweenDate = async (req, res, next) => {
  const { startOfDate, endOfDate } = req.query;
  try {
    if (startOfDate && endOfDate) {
      const news_EN = await PostTypes.findAll({
        where: { name: "ຂ່າວສານ" },
        include: [
          { model: PostTypesTran },
          {
            model: Post,
            where: {
              createdAt: { [Op.between]: [startOfDate, endOfDate] },
              //   createdAt: {
              //     [Op.gte]: startOfDate,
              //     [Op.lte]: endOfDate
              //  },
              status: req.query.status ? req.query.status : "open",
            },
            separate: true,
            order: [["id", "desc"]],
            include: [
              { model: PostTran, separate: true },
              { model: PostImage, separate: true },
              { model: PostImageTran, separate: true },
            ],
          },
        ],
      });

      return res.json({
        success: true,
        message: `Report news between ${startOfDate} and ${endOfDate} success`,
        data: news_EN,
      });
    } else {
      throw createError.BadRequest("Required startOfDate and endOfDate");
    }
  } catch (error) {
    next(error);
  }
};

/**
 * The above function is used to report the top up of the user.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function in the stack.
 */
export const reportTopUp = async (req, res, next) => {
  try {
    let { startDate, endDate } = req.query;
    let sum = 0;
    let condition = null;

    if (req.query.type === "refillCard") condition = "refillCard";
    if (req.query.type === "transfer") condition = "transfer";
   
    // ---------> type registerPackage <-------------
    if (req.query.type === "registerPackage") {
      let registerPackage_Query = null;
      let condition = 'registerPackage';

      if (startDate && endDate) {
        // query histories
        registerPackage_Query = await History.findAll({
          where: {
            type: condition,
            createdAt: { [Op.between]: [startDate, endDate] },
            // createdAt: optionWhereBetweenCreated,
          },
          include: [
            {
              model: Users,
              as: "User",
              attributes: ["id", "phone", "status", "type_user"],
            },
          ],
        });
      } else {
        // query histories
        registerPackage_Query = await History.findAll({
          where: {
            type: condition,
          },
          include: [
            {
              model: Users,
              as: "User",
              attributes: ["id", "phone", "status", "type_user"],
            },
          ],
        });
      }

      return res.json({
        success: true,
        message: `Report data success`,
        data: registerPackage_Query,
      });
    }

    // ----------> all <---------
    if (req.query.type === "all") {
      let sum_total = 0;
      let refillCard_Query = await History.findAll({
        attributes: [
          "type",
          [sequelize.fn("sum", sequelize.col("value")), "total_amount"],
        ],
        group: ["type"],
        raw: true,
      });

      // CONVERT ARRAY STRING TO ARRAY NUMBER and sum total of value column
      refillCard_Query.map((item) => {
        sum_total += Number(item.total_amount);
      });

      return res.json({
        success: true,
        message: `Report data success`,
        sum_total_amout: sum_total,
        data: refillCard_Query,
      });
    }

    // ------------> has condition <-------------
    let refillCard_Query = null;

    if (startDate && endDate) {
      // query histories
      refillCard_Query = await History.findAll({
        where: {
          type: condition,
          createdAt: { [Op.between]: [startDate, endDate] },
          // createdAt: optionWhereBetweenCreated,
        },
        include: [
          {
            model: Users,
            as: "User",
            attributes: ["id", "phone", "status", "type_user"],
          },
        ],
      });
    } else {
      // query histories
      refillCard_Query = await History.findAll({
        where: {
          type: condition,
        },
        include: [
          {
            model: Users,
            as: "User",
            attributes: ["id", "phone", "status", "type_user"],
          },
        ],
      });
    }

    // CONVERT ARRAY STRING TO ARRAY NUMBER and sum total of value column
    refillCard_Query.map((item) => {
      sum += Number(item.value);
    });

    return res.json({
      success: true,
      message: `Report data success`,
      total_amount: sum,
      data: refillCard_Query,
    });
  } catch (error) {
    next(error);
  }
};
