import {
  NewPackage,
  NewPackageTran,
  CatePackage,
  CatePackageTran,
  TypePackage,
  TypePackagTran,
  Users,
  SimType,
  NewPackageSimType,
  Languages,
  History,
  sequelize,
} from "../models";
import createError from "http-errors";
import { Op } from "sequelize";
import { makeSlugify } from "../libs/utils/regex";
import _languages from "../constants/language";
import { packageData } from "../libs/helpers/packagesData";
import {
  DOMAIN,
  REFILL_CARD,
  REGISTER_PACKGE,
  LIST_PACKGE,
  TRANSFER_BALANCE,
  CODE_SUCCESS,
} from "../constants/index";
import {
  addPackageSchema,
  editPackageSchema,
  editPriorityPackageSchema,
  addPackageSimTypeSchema,
  topUpSchema,
  registerPackgeSchema,
  transferUpSchema,
} from "../validators/package.validator";

/**
 * admin --> To create a new package
 * @param {* require data from request} req
 * @param {* send data success response} res
 * @param {* if error is true} next
 * @type mothod POST
 * @access private
 * @returns
 */
export const createPackage = async (req, res, next) => {
  const { files } = req;
  const transaction = await sequelize.transaction();
  try {
    const body = await addPackageSchema.validateAsync(req.body);

    // check type package
    const typePackage = await TypePackage.findByPk(body.typePackage_Id, {
      transaction: transaction,
    });
    if (!typePackage)
      throw createError.BadRequest(
        `This type package ID: ${body.typePackage_Id} does not exist`
      );

    // check category package
    const categoryPackage = await CatePackage.findByPk(body.catePackage_Id, {
      transaction: transaction,
    });
    if (!categoryPackage)
      throw createError.BadRequest(
        `This category package ID: ${body.catePackage_Id} does not exist`
      );

    // check language
    const lang = await Languages.findByPk(body.other_lang[0].language_id, {
      transaction: transaction,
    });
    if (!lang)
      throw createError.NotFound(
        "Languages not found just the moment. Please choose language supported now."
      );

    // check duplicate package
    const package_instance = await NewPackage.findOne(
      { where: { code: body.code } },
      { transaction: transaction }
    );
    if (package_instance)
      throw createError.BadRequest(
        `This code: ${body.code} package is alread exists`
      );

    // find last priority package
    const priorityPackage = await NewPackage.findAll({
      where: { typePackage_Id: typePackage.id },
      limit: 1,
      order: [["priority", "DESC"]],
    });
    // console.log(priorityPackage);
    // return res.json({ priorityPackage })

    // check if file upload or not
    if (!files[0]) {
      // set default when not file upload
      let imageUrl = `${DOMAIN}/images/defaultPackage.jpg`;

      // create a new package
      const newPackage = await NewPackage.create(
        {
          typePackage_Id: typePackage.id,
          catePackage_Id: categoryPackage.id,
          priority:
            priorityPackage.length > 0
              ? priorityPackage[0].priority
                ? priorityPackage[0].priority + 1
                : 1
              : 1,
          code: body.code,
          name: body.name,
          detail: body.detail,
          image: imageUrl,
          slug: makeSlugify(`${body.code}-${body.detail}-${body.name}`),
        },
        { transaction: transaction }
      );

      await NewPackageTran.create(
        {
          package_Id: newPackage.id,
          languageId: lang.id,
          name: body.other_lang[0].name,
          detail: body.other_lang[0].detail,
          image: imageUrl,
          slug: makeSlugify(
            `${body.code}-${body.other_lang[0].detail}-${body.other_lang[0].name}`
          ),
        },
        { transaction: transaction }
      );
      await transaction.commit();

      let responseData = await NewPackage.findByPk(newPackage.id, {
        include: [{ model: NewPackageTran }],
      });

      return res.json({
        success: true,
        message: `Created new package successfully`,
        data: responseData,
      });
    } else {
      // have file upload
      // filter
      let imageUrl = [];
      files
        .filter((file) => file.fieldname == "avatar")
        .forEach((fn) => {
          imageUrl.push(`${DOMAIN}/images/package-images/${fn.filename}`);
        });

      let imageUrlTran = [];
      files
        .filter((file) => file.fieldname == "avatar_EN")
        .forEach((fn) => {
          imageUrlTran.push(`${DOMAIN}/images/package-images/${fn.filename}`);
        });

      // console.log(typeof imageUrlTran[0]);

      // create a new package
      const newPackage = await NewPackage.create(
        {
          typePackage_Id: typePackage.id,
          catePackage_Id: categoryPackage.id,
          priority:
            priorityPackage.length > 0
              ? priorityPackage[0].priority
                ? priorityPackage[0].priority + 1
                : 1
              : 1,
          code: body.code,
          name: body.name,
          detail: body.detail,
          image: imageUrl[0] ? imageUrl[0] : null,
          slug: makeSlugify(`${body.code}-${body.detail}-${body.name}`),
        },
        { transaction: transaction }
      );

      await NewPackageTran.create(
        {
          package_Id: newPackage.id,
          languageId: lang.id,
          name: body.other_lang[0].name,
          detail: body.other_lang[0].detail,
          image: imageUrlTran[0] ? imageUrlTran[0] : null,
          slug: makeSlugify(
            `${body.code}-${body.other_lang[0].detail}-${body.other_lang[0].name}`
          ),
        },
        { transaction: transaction }
      );
      await transaction.commit();

      let responseData = await NewPackage.findByPk(newPackage.id, {
        include: [{ model: NewPackageTran }],
      });

      return res.json({
        success: true,
        message: `Created new package successfully`,
        data: responseData,
      });
    }
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    await transaction.rollback();
    next(error);
  }
};

/**
 * admin --> To update a package
 * @param {* require id and data from request} req
 * @param {* send data success response} res
 * @param {* if error is true} next
 * @type mothod PUT
 * @access private
 * @returns
 */
export const updatePackage = async (req, res, next) => {
  const { id } = req.params;
  const { files } = req;
  const transaction = await sequelize.transaction();
  try {
    const body = await editPackageSchema.validateAsync(req.body);

    // check package
    const packageInstance = await NewPackage.findByPk(id, {
      transaction: transaction,
    });
    if (!packageInstance)
      throw createError.NotFound(`This package does not exist. with ID:${id}`);

    // check type package
    const typePackage = await TypePackage.findByPk(body.typePackage_Id, {
      transaction: transaction,
    });
    if (!typePackage)
      throw createError.BadRequest(
        `This type package ID: ${body.typePackage_Id} does not exist`
      );

    // check category package
    const categoryPackage = await CatePackage.findByPk(body.catePackage_Id, {
      transaction: transaction,
    });
    if (!categoryPackage)
      throw createError.BadRequest(
        `This category package ID: ${body.catePackage_Id} does not exist`
      );

    // check language
    const lang = await Languages.findByPk(body.other_lang[0].language_id, {
      transaction: transaction,
    });
    if (!lang)
      throw createError.NotFound(
        "Languages not found just the moment. Please choose language supported now."
      );

    // check if unique code package
    const uniquePackage = await NewPackage.findAll(
      { where: { code: body.code, id: { [Op.ne]: id } } },
      { transaction: transaction }
    );
    if (uniquePackage[0])
      throw createError.BadRequest(
        `This package code: ${body.code} is already taken`
      );

    // find last priority package
    // const priorityPackage = await NewPackage.findAll({ where: { typePackage_Id: typePackage.id }, limit: 1, order: [['priority', 'DESC']] });

    if (!files[0]) {
      //update
      packageInstance.typePackage_Id = body.typePackage_Id
        ? body.typePackage_Id
        : packageInstance.typePackage_Id;
      packageInstance.catePackage_Id = body.catePackage_Id
        ? body.catePackage_Id
        : packageInstance.catePackage_Id;
      // packageInstance.priority = priorityPackage.length > 0 ? priorityPackage[0].priority ? priorityPackage[0].priority + 1 : 1 : 1,
      packageInstance.code = body.code ? body.code : packageInstance.code;
      packageInstance.name = body.name ? body.name : packageInstance.name;
      packageInstance.detail = body.detail;
      (packageInstance.slug = makeSlugify(
        `${body.code}-${body.detail}-${body.name}`
      )),
        await packageInstance.save();

      await NewPackageTran.update(
        {
          name: body.other_lang[0].name,
          detail: body.other_lang[0].detail,
          slug: makeSlugify(
            `${body.code}-${body.other_lang[0].detail}-${body.other_lang[0].name}`
          ),
        },
        { where: { package_Id: id, languageId: lang.id } },
        { transaction: transaction }
      );
      await transaction.commit();

      let responseData = await NewPackage.findByPk(id, {
        include: [{ model: NewPackageTran }],
      });

      return res.json({
        success: true,
        message: `Updated package ID:${id} successfully`,
        data: responseData,
      });
    } else {
      // have file upload
      // filter
      let imageUrl = [];
      files
        .filter((file) => file.fieldname == "avatar")
        .forEach((fn) => {
          imageUrl.push(`${DOMAIN}/images/package-images/${fn.filename}`);
        });

      let imageUrlTran = [];
      files
        .filter((file) => file.fieldname == "avatar_EN")
        .forEach((fn) => {
          imageUrlTran.push(`${DOMAIN}/images/package-images/${fn.filename}`);
        });

      //update
      packageInstance.typePackage_Id = body.typePackage_Id
        ? body.typePackage_Id
        : packageInstance.typePackage_Id;
      packageInstance.catePackage_Id = body.catePackage_Id
        ? body.catePackage_Id
        : packageInstance.catePackage_Id;
      // packageInstance.priority = priorityPackage.length > 0 ? priorityPackage[0].priority ? priorityPackage[0].priority + 1 : 1 : 1,
      packageInstance.code = body.code ? body.code : packageInstance.code;
      packageInstance.name = body.name ? body.name : packageInstance.name;
      packageInstance.detail = body.detail;
      packageInstance.image = imageUrl[0] ? imageUrl[0] : null;
      (packageInstance.slug = makeSlugify(
        `${body.code}-${body.detail}-${body.name}`
      )),
        await packageInstance.save();

      await NewPackageTran.update(
        {
          name: body.other_lang[0].name,
          detail: body.other_lang[0].detail,
          image: imageUrlTran[0] ? imageUrlTran[0] : null,
          slug: makeSlugify(
            `${body.code}-${body.other_lang[0].detail}-${body.other_lang[0].name}`
          ),
        },
        { where: { package_Id: id, languageId: lang.id } },
        { transaction: transaction }
      );
      await transaction.commit();

      let responseData = await NewPackage.findByPk(id, {
        include: [{ model: NewPackageTran }],
      });

      return res.json({
        success: true,
        message: `Updated package ID:${id} successfully`,
        data: responseData,
      });
    }
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    await transaction.rollback();
    next(error);
  }
};

/**
 * admin --> To update priorities package
 * @param {* require array id of package to update} req
 * @param {* send data success response} res
 * @param {* if error is true} next
 * @type mothod PUT
 * @access private
 * @returns
 */
export const updatePriorityPackage = async (req, res, next) => {
  let { typePackage_id } = req.params;
  const id = typePackage_id;
  const transaction = await sequelize.transaction();
  try {
    const body = await editPriorityPackageSchema.validateAsync(req.body);

    // update priority package
    await Promise.all(
      body.map(async (item, index) => {
        let newPriority = index + 1;
        await NewPackage.update(
          {
            priority: newPriority,
          },
          { where: { id: item.id, typePackage_Id: id } },
          { transaction: transaction }
        );
      })
    );
    await transaction.commit();

    let responseData = await TypePackage.findByPk(id, {
      include: [
        { model: TypePackagTran },
        {
          model: NewPackage,
          separate: true,
          include: [{ model: NewPackageTran }],
          order: [["priority", "ASC"]],
        },
      ],
    });

    return res.json({
      success: true,
      message: `Updated priority package type ID:${id} success`,
      data: responseData,
    });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    await transaction.rollback();
    next(error);
  }
};

/**
 * admin --> To get package by type for update priority package
 * @param {* require type package id and language from request} req
 * @param {* send data success response} res
 * @param {* if error is true} next
 * @type mothod GET
 * @access public
 * @returns
 */
export const findPackageByTypeAndPriority = async (req, res, next) => {
  let { typePackage_id } = req.params;
  const id = typePackage_id;
  const lang = req.query.lang || req.headers.content_language;
  try {
    if (lang !== undefined) {
      // check language
      const language = await Languages.findOne({ where: { short: lang } });
      if (!language)
        throw createError.NotFound(
          "Languages not found just the moment. Please choose language supported now."
        );
      if (language.short === _languages.ENGLISH) {
        // english
        const typePackage_Instance = await TypePackage.findByPk(id, {
          include: [
            { model: TypePackagTran },
            {
              model: NewPackage,
              separate: true,
              include: [{ model: NewPackageTran }],
              order: [["priority", "ASC"]],
            },
          ],
        });
        if (!typePackage_Instance)
          throw createError.NotFound(`Type package not found. with ID:${id}`);

        return res.json({
          success: true,
          message: "Get package by type success",
          data: typePackage_Instance,
        });
      }
      // la
      const typePackage_Instance = await TypePackage.findByPk(id, {
        include: [
          { model: NewPackage, separate: true, order: [["priority", "ASC"]] },
        ],
      });
      if (!typePackage_Instance)
        throw createError.NotFound(`Type package not found. with ID:${id}`);

      return res.json({
        success: true,
        message: "Get package by type success",
        data: typePackage_Instance,
      });
    } else {
      // if not defined lang. will set default language
      const typePackage_Instance = await TypePackage.findByPk(id, {
        include: [
          { model: NewPackage, separate: true, order: [["priority", "ASC"]] },
        ],
      });
      if (!typePackage_Instance)
        throw createError.NotFound(`Type package not found. with ID:${id}`);

      return res.json({
        success: true,
        message: "Get package by type success",
        data: typePackage_Instance,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * admin & client --> To get a package
 * @param {* require language from request} req
 * @param {* send data success response} res
 * @param {* if error is true} next
 * @type mothod GET
 * @access public
 * @returns
 */
export const findPackage = async (req, res, next) => {
  const lang = req.query.lang || req.headers.content_language;
  try {
    if (lang !== undefined) {
      // check language
      const language = await Languages.findOne({ where: { short: lang } });
      if (!language)
        throw createError.NotFound(
          "Languages not found just the moment. Please choose language supported now."
        );
      if (language.short === _languages.ENGLISH) {
        // eng
        const packageInstance = await NewPackage.findAll({
          include: [
            // { model: Cate_Package, as: 'categoryPackage', attributes: ['id', 'cateName_package'], include: [{ model: Cate_PackageTran }] },
            {
              model: TypePackage,
              as: "typePackage",
              include: [{ model: TypePackagTran }],
            },
            {
              model: CatePackage,
              as: "categoryPackage",
              include: [{ model: CatePackageTran }],
            },
            { model: NewPackageTran },
          ],
          order: [["id", "DESC"]],
        });
        return res.json({
          success: true,
          message: "Get all packages english language successfully",
          data: packageInstance,
        });
      }
      // la
      const packageInstance = await NewPackage.findAll({
        include: [
          // { model: Cate_Package, as: 'categoryPackage', attributes: ['id', 'cateName_package'] },
          { model: TypePackage, as: "typePackage" },
          { model: CatePackage, as: "categoryPackage" },
        ],
        order: [["id", "DESC"]],
      });
      return res.json({
        success: true,
        message: "Get all packages lao language successfully",
        data: packageInstance,
      });
    } else {
      // undefined lang
      // if not defined lang. we set default
      const packageInstance = await NewPackage.findAll({
        include: [
          // { model: Cate_Package, as: 'categoryPackage', attributes: ['id', 'cateName_package'] },
          { model: TypePackage, as: "typePackage" },
          { model: CatePackage, as: "categoryPackage" },
        ],
        order: [["id", "DESC"]],
      });
      return res.json({
        success: true,
        message: "Get all packages lao language successfully",
        data: packageInstance,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * client --> To search package before login
 * @param {* require language and search parameters} req
 * @param {* send data success response} res
 * @param {* if error is true} next
 * @type mothod GET
 * @access public
 * @returns
 */
export const searchPackageBeforeLogin = async (req, res, next) => {
  const lang = req.query.lang || req.headers.content_language;
  let search = req.query.search;
  try {
    // check default lan or not
    if (lang !== undefined) {
      // check language
      const language = await Languages.findOne({ where: { short: lang } });
      if (!language)
        throw createError.NotFound(
          "Languages not found just the moment. Please choose language supported now."
        );
      if (language.short === _languages.ENGLISH) {
        // eng
        // let packageInstance = await NewPackage.findAll({
        //     where:
        //         { name: { [Op.like]: `%${search}%` } }, include: [
        //             { model: TypePackage, as: 'typePackage', include: [{ model: TypePackagTran }] },
        //             { model: CatePackage, as: 'categoryPackage', include: [{ model: CatePackageTran }] },
        //             { model: NewPackageTran }]
        // });

        let packageInstance = await NewPackage.findAll({
          where: {
            [Op.or]: [
              { name: { [Op.like]: `%${search}%` } },
              { detail: { [Op.like]: `%${search}%` } },
            ],
          },
          include: [
            {
              model: TypePackage,
              as: "typePackage",
              include: [{ model: TypePackagTran }],
            },
            {
              model: CatePackage,
              as: "categoryPackage",
              include: [{ model: CatePackageTran }],
            },
            { model: NewPackageTran },
          ],
        });

        if (!packageInstance[0]) {
          packageInstance = await NewPackage.findAll({
            include: [
              {
                model: TypePackage,
                as: "typePackage",
                include: [{ model: TypePackagTran }],
              },
              {
                model: CatePackage,
                as: "categoryPackage",
                include: [{ model: CatePackageTran }],
              },
              {
                model: NewPackageTran,
                where: {
                  [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    { detail: { [Op.like]: `%${search}%` } },
                  ],
                },
                require: true,
                as: "NewPackageTrans",
              },
            ],
          });
        }

        return res.json({
          success: true,
          message: "Search package before login success",
          data: packageInstance,
        });
      }
      // lao
      let packageInstance = await NewPackage.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { detail: { [Op.like]: `%${search}%` } },
          ],
        },
        include: [
          {
            model: TypePackage,
            as: "typePackage",
            include: [{ model: TypePackagTran }],
          },
          {
            model: CatePackage,
            as: "categoryPackage",
            include: [{ model: CatePackageTran }],
          },
          { model: NewPackageTran },
        ],
      });

      if (!packageInstance[0]) {
        packageInstance = await NewPackage.findAll({
          include: [
            { model: TypePackage, as: "typePackage" },
            { model: CatePackage, as: "categoryPackage" },
            {
              model: NewPackageTran,
              where: {
                [Op.or]: [
                  { name: { [Op.like]: `%${search}%` } },
                  { detail: { [Op.like]: `%${search}%` } },
                ],
              },
              require: true,
              as: "NewPackageTrans",
            },
          ],
        });
      }

      return res.json({
        success: true,
        message: "Search package before login success",
        data: packageInstance,
      });
    } else {
      // if not defined lang. will set default language
      let packageInstance = await NewPackage.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { detail: { [Op.like]: `%${search}%` } },
          ],
        },
        include: [
          {
            model: TypePackage,
            as: "typePackage",
            include: [{ model: TypePackagTran }],
          },
          {
            model: CatePackage,
            as: "categoryPackage",
            include: [{ model: CatePackageTran }],
          },
          { model: NewPackageTran },
        ],
      });

      if (!packageInstance[0]) {
        packageInstance = await NewPackage.findAll({
          include: [
            { model: TypePackage, as: "typePackage" },
            { model: CatePackage, as: "categoryPackage" },
            {
              model: NewPackageTran,
              where: {
                [Op.or]: [
                  { name: { [Op.like]: `%${search}%` } },
                  { detail: { [Op.like]: `%${search}%` } },
                ],
              },
              require: true,
              as: "NewPackageTrans",
            },
          ],
        });
      }

      return res.json({
        success: true,
        message: "Search package before login success",
        data: packageInstance,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * client --> To search package after login
 * @param {* require language and filter parameters} req
 * @param {* send data success response} res
 * @param {* if error is true} next
 * @type mothod GET
 * @access public
 * @returns
 */
export const searchPackageAfterLogin = async (req, res, next) => {
  const userInfo = req.user;
  const lang = req.query.lang || req.headers.content_language;
  let search = req.query.search;
  try {
    const user = await Users.findOne({
      where: { phone: userInfo.phone, status: "active" },
      attributes: ["id", "phone", "status", "createdAt", "updatedAt"],
    });

    if (!user)
      throw createError.NotFound(
        `This phone number does not exist. Please register your account`
      );

    const packages = await packageData(LIST_PACKGE, user.phone);

    let mainProductID = packages.data.Mainproduct;

    // check define lang or not
    if (lang !== undefined) {
      // check language
      const language = await Languages.findOne({ where: { short: lang } });
      if (!language)
        throw createError.NotFound(
          "Languages not found just the moment. Please choose language supported now."
        );
      if (language.short === _languages.ENGLISH) {
        // english
        let packageSimType = await SimType.findOne({
          where: { mainProduct: mainProductID },
          include: [
            {
              model: NewPackage,
              where: {
                [Op.or]: [
                  { name: { [Op.like]: `%${search}%` } },
                  { detail: { [Op.like]: `%${search}%` } },
                ],
              },
              as: "newPackages",
              include: [
                {
                  model: TypePackage,
                  as: "typePackage",
                  include: [{ model: TypePackagTran }],
                },
                {
                  model: CatePackage,
                  as: "categoryPackage",
                  include: [{ model: CatePackageTran }],
                },
                { model: NewPackageTran },
              ],
            },
          ],
          order: [["newPackages", "id", "DESC"]],
        });

        if (!packageSimType) {
          packageSimType = await SimType.findOne({
            where: { mainProduct: mainProductID },
            include: [
              {
                model: NewPackage,
                as: "newPackages",
                include: [
                  {
                    model: TypePackage,
                    as: "typePackage",
                    include: [{ model: TypePackagTran }],
                  },
                  {
                    model: CatePackage,
                    as: "categoryPackage",
                    include: [{ model: CatePackageTran }],
                  },
                  {
                    model: NewPackageTran,
                    where: {
                      [Op.or]: [
                        { name: { [Op.like]: `%${search}%` } },
                        { detail: { [Op.like]: `%${search}%` } },
                      ],
                    },
                  },
                ],
              },
            ],
            order: [["newPackages", "id", "DESC"]],
          });
        }

        return res.json({
          success: true,
          message: `Search package data after login successfully`,
          data: packageSimType ? packageSimType.newPackages : packageSimType,
        });
      }
      // lao
      let packageSimType = await SimType.findOne({
        where: { mainProduct: mainProductID },
        include: [
          {
            model: NewPackage,
            where: {
              [Op.or]: [
                { name: { [Op.like]: `%${search}%` } },
                { detail: { [Op.like]: `%${search}%` } },
              ],
            },
            as: "newPackages",
            include: [
              { model: TypePackage, as: "typePackage" },
              { model: CatePackage, as: "categoryPackage" },
            ],
          },
        ],
        order: [["newPackages", "id", "DESC"]],
      });

      if (!packageSimType) {
        packageSimType = await SimType.findOne({
          where: { mainProduct: mainProductID },
          include: [
            {
              model: NewPackage,
              as: "newPackages",
              include: [
                { model: TypePackage, as: "typePackage" },
                { model: CatePackage, as: "categoryPackage" },
                {
                  model: NewPackageTran,
                  where: {
                    [Op.or]: [
                      { name: { [Op.like]: `%${search}%` } },
                      { detail: { [Op.like]: `%${search}%` } },
                    ],
                  },
                },
              ],
            },
          ],
          order: [["newPackages", "id", "DESC"]],
        });
      }

      return res.json({
        success: true,
        message: `Search package data after login successfully`,
        data: packageSimType ? packageSimType.newPackages : packageSimType,
      });
    } else {
      // if not defined lang. will set default language
      let packageSimType = await SimType.findOne({
        where: { mainProduct: mainProductID },
        include: [
          {
            model: NewPackage,
            where: {
              [Op.or]: [
                { name: { [Op.like]: `%${search}%` } },
                { detail: { [Op.like]: `%${search}%` } },
              ],
            },
            as: "newPackages",
            include: [
              { model: TypePackage, as: "typePackage" },
              { model: CatePackage, as: "categoryPackage" },
            ],
          },
        ],
        order: [["newPackages", "id", "DESC"]],
      });

      if (!packageSimType) {
        packageSimType = await SimType.findOne({
          where: { mainProduct: mainProductID },
          include: [
            {
              model: NewPackage,
              as: "newPackages",
              include: [
                { model: TypePackage, as: "typePackage" },
                { model: CatePackage, as: "categoryPackage" },
                {
                  model: NewPackageTran,
                  where: {
                    [Op.or]: [
                      { name: { [Op.like]: `%${search}%` } },
                      { detail: { [Op.like]: `%${search}%` } },
                    ],
                  },
                },
              ],
            },
          ],
          order: [["newPackages", "id", "DESC"]],
        });
      }

      return res.json({
        success: true,
        message: `Search package data after login successfully`,
        data: packageSimType ? packageSimType.newPackages : packageSimType,
      });
    }
  } catch (error) {
    next(error);
  }
};

// export const searchPackage = async (req, res, next) => {
//     let before = 'beforeLogin';
//     let after = 'afterLogin';
//     const userInfo = req.user;
//     const lang = req.query.lang || req.headers.content_language;
//     const action = req.query.action;
//     let search = req.query.search;
//     try {
//         // if (lang !== undefined) {
//         //     // check language
//         //     const language = await Languages.findOne({ where: { short: lang } });
//         //     if (!language) throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
//         //     if (language.short === _languages.ENGLISH) {
//         //         // eng
//         //     }

//         // } else {

//         // }
//         if (action === before) {
//             // check default lan or not
//             if (lang !== undefined) {
//                 // check language
//                 const language = await Languages.findOne({ where: { short: lang } });
//                 if (!language) throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
//                 if (language.short === _languages.ENGLISH) {
//                     // eng
//                     let packageInstance = await NewPackage.findAll({
//                         where:
//                             { name: { [Op.like]: `%${search}%` } }, include: [{ model: NewPackageTran }]
//                     });

//                     if (!packageInstance[0]) {

//                         packageInstance = await NewPackage.findAll({
//                             include: [{ model: NewPackageTran, where: { name: { [Op.like]: `%${search}%` } }, require: true, as: 'NewPackageTrans' }]
//                         });
//                     }

//                     return res.json({
//                         success: true,
//                         message: "Search before login",
//                         data: packageInstance,
//                     });

//                 }
//                 // la
//                 // todo: lao
//                 let packageInstance = await NewPackage.findAll({
//                     where:
//                         { name: { [Op.like]: `%${search}%` } },
//                 });
//                 return res.json({
//                     success: true,
//                     message: "Search before login",
//                     data: packageInstance,
//                 });

//             } else {
//                 // if not defined lang. will set default language
//                 let packageInstance = await NewPackage.findAll({
//                     where:
//                         { name: { [Op.like]: `%${search}%` } }, include: [{ model: NewPackageTran }]
//                 });

//                 if (!packageInstance[0]) {

//                     packageInstance = await NewPackage.findAll({
//                         include: [{ model: NewPackageTran, where: { name: { [Op.like]: `%${search}%` } }, require: true, as: 'NewPackageTrans' }]
//                     });
//                 }

//                 return res.json({
//                     success: true,
//                     message: "Search before login",
//                     data: packageInstance,
//                 });
//             }

//         } else if (action === after) {

//             const user = await Users.findOne({
//                 where:
//                     { phone: userInfo.phone, status: 'active' }, attributes: ['id', 'phone', 'status', 'createdAt', 'updatedAt']
//             });

//             if (!user) throw createError.NotFound(`This phone number does not exist. Please register your account`);

//             const packages = await packageData(LIST_PACKGE, user.phone);

//             let mainProductID = packages.data.Mainproduct;

//             // return res.json({ message: 'Okkk', data: user });

//             // check define lang or not
//             if (lang !== undefined) {
//                 // check language
//                 const language = await Languages.findOne({ where: { short: lang } });
//                 if (!language) throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
//                 if (language.short === _languages.ENGLISH) {
//                     // english
//                     let packageSimType = await SimType.findOne({
//                         where:
//                             { mainProduct: mainProductID },
//                         include: [
//                             {
//                                 model: NewPackage, where: { name: { [Op.like]: `%${search}%` } }, as: 'newPackages',
//                                 include: [
//                                     { model: TypePackage, as: 'typePackage', include: [{ model: TypePackagTran }] },
//                                     { model: NewPackageTran }]
//                             }], order: [['newPackages', 'id', 'DESC']]
//                     });

//                     console.log("ddddd", packageSimType);

//                     if (!packageSimType) {
//                         console.log(888888888);

//                         packageSimType = await SimType.findOne({
//                             where:
//                                 { mainProduct: mainProductID },
//                             include: [
//                                 {
//                                     model: NewPackage, as: 'newPackages',
//                                     include: [
//                                         { model: TypePackage, as: 'typePackage', include: [{ model: TypePackagTran }] },
//                                         { model: NewPackageTran, where: { name: { [Op.like]: `%${search}%` } } }]
//                                 }], order: [['newPackages', 'id', 'DESC']]
//                         });
//                     }

//                     // let rs = await Promise.all(packageSimType.newPackages.map(async (item) => {
//                     //     // await TypePackagTran.create(item);
//                     //   }));

//                     return res.json({
//                         success: true,
//                         message: `Get package data after login successfully`,
//                         data: packageSimType
//                     });
//                 }
//                 // lao

//             } else {

//             }

//             return res.json({ message: "After" });
//         } else {
//             throw createError.BadRequest(`Please! define action`);
//         }

//     } catch (error) {
//         next(error);
//     }
// }

/**
 * client --> To get a package
 * @param {* require id and language from request} req
 * @param {* send data success response} res
 * @param {* if error is true} next
 * @type mothod GET
 * @access public
 * @returns
 */
export const findOnePackageBySlug = async (req, res, next) => {
  const { slug } = req.params;
  const lang = req.query.lang || req.headers.content_language;
  try {
    if (lang !== undefined) {
      // check language
      const language = await Languages.findOne({ where: { short: lang } });
      if (!language) {
        throw createError.NotFound(
          "Languages not found just the moment. Please choose language supported now."
        );
      }

      if (language.short === _languages.ENGLISH) {
        // eng
        let packageInstance = await NewPackage.findOne({
          where: { slug: slug },
          include: [
            // { model: Cate_Package, as: 'categoryPackage', attributes: ['id', 'cateName_package'], include: [{ model: Cate_PackageTran }] },
            {
              model: TypePackage,
              as: "typePackage",
              attributes: ["id", "type_name", "image"],
              include: [{ model: TypePackagTran }],
            },
            {
              model: CatePackage,
              as: "categoryPackage",
              include: [{ model: CatePackageTran }],
            },
            { model: NewPackageTran },
          ],
        });

        if (!packageInstance) {
          packageInstance = await NewPackage.findOne({
            include: [
              // { model: Cate_Package, as: 'categoryPackage', attributes: ['id', 'cateName_package'], include: [{ model: Cate_PackageTran }] },
              {
                model: TypePackage,
                as: "typePackage",
                attributes: ["id", "type_name", "image"],
                include: [{ model: TypePackagTran }],
              },
              {
                model: CatePackage,
                as: "categoryPackage",
                include: [{ model: CatePackageTran }],
              },
              { model: NewPackageTran, where: { slug: slug } },
            ],
          });
          if (!packageInstance)
            throw createError.NotFound(
              `This package does not exist. with ID:${slug}`
            );
        }

        return res.json({
          success: true,
          message: `Get a package english language successfully`,
          data: packageInstance,
        });
      }
      // la
      const packageInstance = await NewPackage.findOne({
        where: { slug: slug },
        include: [
          // { model: Cate_Package, as: 'categoryPackage', attributes: ['id', 'cateName_package'] },
          {
            model: TypePackage,
            as: "typePackage",
            attributes: ["id", "type_name", "image"],
          },
          { model: CatePackage, as: "categoryPackage" },
        ],
      });

      if (!packageInstance)
        throw createError.NotFound(
          `This package does not exist. with ID:${slug}`
        );
      return res.json({
        success: true,
        message: `Get a package lao language successfully`,
        data: packageInstance,
      });
    } else {
      // undefined lang
      // if undefined lang. we set default
      const packageInstance = await NewPackage.findOne({
        where: { slug: slug },
        include: [
          // { model: Cate_Package, as: 'categoryPackage', attributes: ['id', 'cateName_package'] },
          {
            model: TypePackage,
            as: "typePackage",
            attributes: ["id", "type_name", "image"],
          },
          { model: CatePackage, as: "categoryPackage" },
        ],
      });

      if (!packageInstance)
        throw createError.NotFound(
          `This package does not exist. with ID:${slug}`
        );
      return res.json({
        success: true,
        message: `Get a package lao language successfully`,
        data: packageInstance,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * admin & client --> To get a package
 * @param {* require id and language from request} req
 * @param {* send data success response} res
 * @param {* if error is true} next
 * @type mothod GET
 * @access public
 * @returns
 */
export const findOnePackage = async (req, res, next) => {
  const { id } = req.params;
  const lang = req.query.lang || req.headers.content_language;
  try {
    if (lang !== undefined) {
      const language = await Languages.findOne({ where: { short: lang } });
      if (!language) {
        throw createError.NotFound(
          "Languages not found just the moment. Please choose language supported now."
        );
      }

      if (language.short === _languages.ENGLISH) {
        // eng
        const packageInstance = await NewPackage.findByPk(id, {
          include: [
            // { model: Cate_Package, as: 'categoryPackage', attributes: ['id', 'cateName_package'], include: [{ model: Cate_PackageTran }] },
            {
              model: TypePackage,
              as: "typePackage",
              attributes: ["id", "type_name", "image"],
              include: [{ model: TypePackagTran }],
            },
            {
              model: CatePackage,
              as: "categoryPackage",
              include: [{ model: CatePackageTran }],
            },
            { model: NewPackageTran },
          ],
        });

        if (!packageInstance)
          throw createError.NotFound(
            `This package does not exist. with ID:${id}`
          );
        return res.json({
          success: true,
          message: `Get a package english language successfully`,
          data: packageInstance,
        });
      }
      // la
      const packageInstance = await NewPackage.findByPk(id, {
        include: [
          // { model: Cate_Package, as: 'categoryPackage', attributes: ['id', 'cateName_package'] },
          {
            model: TypePackage,
            as: "typePackage",
            attributes: ["id", "type_name", "image"],
          },
          { model: CatePackage, as: "categoryPackage" },
        ],
      });

      if (!packageInstance)
        throw createError.NotFound(
          `This package does not exist. with ID:${id}`
        );
      return res.json({
        success: true,
        message: `Get a package lao language successfully`,
        data: packageInstance,
      });
    } else {
      // undefined lang
      // if undefined lang. we set default
      const packageInstance = await NewPackage.findByPk(id, {
        include: [
          // { model: Cate_Package, as: 'categoryPackage', attributes: ['id', 'cateName_package'] },
          {
            model: TypePackage,
            as: "typePackage",
            attributes: ["id", "type_name", "image"],
          },
          { model: CatePackage, as: "categoryPackage" },
        ],
      });

      if (!packageInstance)
        throw createError.NotFound(
          `This package does not exist. with ID:${id}`
        );
      return res.json({
        success: true,
        message: `Get a package lao language successfully`,
        data: packageInstance,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * client --> To get package before login by type package
 * @param {* require id and language from request} req
 * @param {* send data success response} res
 * @param {* if error is true} next
 * @type mothod GET
 * @access public
 * @returns
 */
export const findPackageByType = async (req, res, next) => {
  const { id } = req.params;
  const lang = req.query.lang || req.headers.content_language;
  const paginate = req.query.filter_record;
  try {
    // check lang
    if (lang !== undefined) {
      const language = await Languages.findOne({ where: { short: lang } });
      if (!language)
        throw createError.NotFound(
          "Languages not found just the moment. Please choose language supported now."
        );

      if (language.short === _languages.ENGLISH) {
        // eng
        // check paginate
        if (paginate === undefined || !paginate.length > 0) {
          // not filter records. will get all records
          const typePackage_Instance = await TypePackage.findByPk(id, {
            include: [
              { model: TypePackagTran },
              {
                model: NewPackage,
                separate: true,
                include: [{ model: NewPackageTran }],
                order: [["id", "DESC"]],
              },
            ],
          });
          if (!typePackage_Instance)
            throw createError.NotFound(`Type package not found. with ID:${id}`);

          return res.json({
            success: true,
            message: "filter record not data",
            data: typePackage_Instance,
          });
        }
        if (isFinite(paginate)) {
          // have filter records. will get lated by number filter
          let numberFilter = parseInt(paginate, 10);
          const typePackage_Instance = await TypePackage.findByPk(id, {
            include: [
              { model: TypePackagTran },
              {
                model: NewPackage,
                limit: numberFilter,
                include: [{ model: NewPackageTran }],
                order: [["id", "DESC"]],
              },
            ],
          });
          if (!typePackage_Instance)
            throw createError.NotFound(`Type package not found. with ID:${id}`);

          return res.json({
            success: true,
            message: "filter is number",
            data: typePackage_Instance,
          });
        } else {
          throw createError.BadRequest(`Filter records should be a number`);
        }
      }
      //------> default language <---------
      // check paginate
      if (paginate === undefined || !paginate.length > 0) {
        // not filter records. will get all records
        const typePackage_Instance = await TypePackage.findByPk(id, {
          include: [
            { model: NewPackage, separate: true, order: [["id", "DESC"]] },
          ],
        });
        if (!typePackage_Instance)
          throw createError.NotFound(`Type package not found. with ID:${id}`);

        return res.json({
          success: true,
          message: "filter record not data",
          data: typePackage_Instance,
        });
      }
      if (isFinite(paginate)) {
        // have filter records. will get lated by number filter
        let numberFilter = parseInt(paginate, 10);
        const typePackage_Instance = await TypePackage.findByPk(id, {
          include: [
            { model: NewPackage, limit: numberFilter, order: [["id", "DESC"]] },
          ],
        });
        if (!typePackage_Instance)
          throw createError.NotFound(`Type package not found. with ID:${id}`);

        return res.json({
          success: true,
          message: "filter is number",
          data: typePackage_Instance,
        });
      } else {
        throw createError.BadRequest(`Filter records should be a number`);
      }
    } else {
      // if not defined lang. will get default language
      // check paginate
      if (paginate === undefined || !paginate.length > 0) {
        // not filter records. will get all records
        const typePackage_Instance = await TypePackage.findByPk(id, {
          include: [
            { model: NewPackage, separate: true, order: [["id", "DESC"]] },
          ],
        });
        if (!typePackage_Instance)
          throw createError.NotFound(`Type package not found. with ID:${id}`);

        return res.json({
          success: true,
          message: "filter record not data",
          data: typePackage_Instance,
        });
      }

      if (isFinite(paginate)) {
        // have filter records. will get lated by number filter
        let numberFilter = parseInt(paginate, 10);
        const typePackage_Instance = await TypePackage.findByPk(id, {
          include: [
            { model: NewPackage, limit: numberFilter, order: [["id", "DESC"]] },
          ],
        });
        if (!typePackage_Instance)
          throw createError.NotFound(`Type package not found. with ID:${id}`);

        return res.json({
          success: true,
          message: "filter is number",
          data: typePackage_Instance,
        });
      } else {
        throw createError.BadRequest(`Filter records should be a number`);
      }
    }
  } catch (error) {
    next(error);
  }
};

// -------------> find package by category <--------------
/**
 * Find a category package by category id and type package id
 * @param req - The request object.
 * @param res - response object
 * @param next - The next middleware function in the chain.
 * @returns The data is being returned in the form of an object.
 */
export const findPackageByCategory = async (req, res, next) => {
  const { type_id, cate_id } = req.params;
  const lang = req.query.lang || req.headers.content_language;
  try {
    // check type id
    const typePackage = await TypePackage.findByPk(type_id);
    if (!typePackage)
      throw createError.NotFound(`Type package not found. with ID:${id}`);

    // check category id

    if (lang !== undefined) {
      const language = await Languages.findOne({ where: { short: lang } });
      if (!language)
        throw createError.NotFound(
          "Languages not found just the moment. Please choose language supported now."
        );

      if (language.short === _languages.ENGLISH) {
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
      // la
      let packageCategory = await CatePackage.findByPk(cate_id, {
        include: [
          {
            model: NewPackage,
            where: { typePackage_Id: type_id },
            required: true,
            include: [{ model: TypePackage, as: "typePackage" }],
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
    } else {
      // if not defined lang. will set default language
      let packageCategory = await CatePackage.findByPk(cate_id, {
        include: [
          {
            model: NewPackage,
            where: { typePackage_Id: type_id },
            required: true,
            include: [{ model: TypePackage, as: "typePackage" }],
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
  } catch (error) {
    next(error);
  }
};

/**
 * admin --> To delete a package
 * @param {* require id from request} req
 * @param {* send data success response} res
 * @param {* if error is true} next
 * @type mothod DELETE
 * @access private
 * @returns
 */
export const deletePackage = async (req, res, next) => {
  const { id } = req.params;
  const transaction = await sequelize.transaction();
  try {
    let typeId = null;

    const packageSimType = await NewPackageSimType.findAll(
      { where: { newpackageId: id } },
      { transaction: transaction }
    );
    if (packageSimType.length > 0) {
      throw createError.BadRequest(
        `Unable to delete ID:${id} at this time. Because the newPackageSimType table is active`
      );
    }

    const _package = await NewPackage.findByPk(id, {
      transaction: transaction,
    });
    typeId = _package.typePackage_Id; // store type package Id 
 
    if (!_package)
      throw createError.NotFound(`This package does not exist. with ID:${id}`);
    await NewPackageTran.destroy(
      { where: { package_Id: id } },
      { transaction: transaction }
    );
    await _package.destroy();

    // ---------> update new priority package after delete <---------
    // get all priority
    let priorityPackage = await NewPackage.findAll(
      { where: { typePackage_Id: typeId }, order: [["priority", "ASC"]] },
      { transaction: transaction }
    );

    // update new priority package
    await Promise.all(
      priorityPackage.map(async (item, index) => {
        let newPriority = index + 1;
        await NewPackage.update(
          {
            priority: newPriority,
          },
          { where: { id: item.id } },
          { transaction: transaction }
        );
      })
    );

    await transaction.commit();
    return res.json({
      success: true,
      message: `Deleted package ID:${id} successfully`,
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

export const findPackageHasSimTypes = async (req, res, next) => {
  const { id } = req.params;
  const lang = req.query.lang || req.headers.content_language;
  try {
    if (lang !== undefined) {
      // check language
      const language = await Languages.findOne({ where: { short: lang } });
      if (!language)
        throw createError.NotFound(
          "Languages not found just the moment. Please choose language supported now."
        );

      if (language.short === _languages.ENGLISH) {
        // eng
        const packagesSimTypes = await NewPackage.findByPk(id, {
          include: [
            {
              model: TypePackage,
              as: "typePackage",
              include: [{ model: TypePackagTran }],
            },
            {
              model: CatePackage,
              as: "categoryPackage",
              include: [{ model: CatePackageTran }],
            },
            { model: NewPackageTran },
            { model: SimType, as: "simTypes" },
          ],
        });
        if (!packagesSimTypes)
          throw createError.NotFound(
            `This package does not exist. with ID:${id}`
          );
        return res.json({
          success: true,
          message: `Get data package has simTypes success`,
          data: packagesSimTypes,
        });
      }
      // la
      const packagesSimTypes = await NewPackage.findByPk(id, {
        include: [
          { model: TypePackage, as: "typePackage" },
          { model: CatePackage, as: "categoryPackage" },
          { model: SimType, as: "simTypes" },
        ],
      });
      if (!packagesSimTypes)
        throw createError.NotFound(
          `This package does not exist. with ID:${id}`
        );
      return res.json({
        success: true,
        message: `Get data package has simTypes success`,
        data: packagesSimTypes,
      });
    } else {
      // if not defined lang. will set default language
      const packagesSimTypes = await NewPackage.findByPk(id, {
        include: [
          { model: TypePackage, as: "typePackage" },
          { model: CatePackage, as: "categoryPackage" },
          { model: SimType, as: "simTypes" },
        ],
      });
      if (!packagesSimTypes)
        throw createError.NotFound(
          `This package does not exist. with ID:${id}`
        );
      return res.json({
        success: true,
        message: `Get data package has simTypes success`,
        data: packagesSimTypes,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * admin --> To add packages to simTypes
 * @param {* require id simTypes from request} req
 * @param {* send data success response} res
 * @param {* if error is true} next
 * @type mothod POST
 * @access private
 * @returns
 */
export const addPackageSimType = async (req, res, next) => {
  const { id } = req.params;
  const transaction = await sequelize.transaction();
  try {
    const body = await addPackageSimTypeSchema.validateAsync(req.body);

    let packageSimTypeId = body.map((item) => item.simTypeId);

    const packageInstance = await NewPackage.findByPk(id, {
      transaction: transaction,
    });
    if (!packageInstance)
      throw createError.NotFound(`This package does not exist. with ID:${id}`);

    await packageInstance.addSimType(packageSimTypeId);
    await transaction.commit();

    const responseData = await NewPackage.findByPk(id, {
      include: [{ model: SimType, as: "simTypes" }],
    });
    return res.json({
      success: true,
      message: `Package add sim types successfully`,
      data: responseData,
    });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    await transaction.rollback();
    next(error);
  }
};

/**
 * amdin --> To delete a package simtype
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const deletePackageSimType = async (req, res, next) => {
  const { package_id, simType_id } = req.params;
  const transaction = await sequelize.transaction();
  try {
    const packageSimType = await NewPackageSimType.findOne(
      {
        where: { newpackageId: package_id, simTypeId: simType_id },
      },
      { transaction: transaction }
    );
    if (!packageSimType)
      throw createError.NotFound(`This package sim type does not exist`);
    await packageSimType.destroy();
    await transaction.commit();
    return res.json({
      success: true,
      message: `Deleted package ID: ${package_id} and sim type ID: ${simType_id} successfully`,
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

/**
 * client --> To get all packages data after login.
 * @param {* require action and phone number use login } req
 * @param {* send data success response} res
 * @param {* if error is true} next
 * @type mothod GET
 * @access private
 * @returns
 */
export const listPackageSimTypes = async (req, res, next) => {
  const userInfo = req.user;
  const { type_id, cate_id } = req.params;
  const lang = req.query.lang || req.headers.content_language;
  // console.log("444==>", type_id);
  // console.log("555==>", cate_id);
  try {
    // // check type id
    // const type = await TypePackage.findByPk(type_id);
    // if (!type) throw createError.NotFound(`Type package not found. with ID:${type_id}`);

    // check categories package
    const categories = await CatePackage.findByPk(cate_id);
    if (!categories)
      throw createError.NotFound(
        `Category package not found. with ID:${cate_id}`
      );

    const user = await Users.findOne({
      where: { phone: userInfo.phone, status: "active" },
      attributes: ["id", "phone", "status", "createdAt", "updatedAt"],
    });

    if (!user)
      throw createError.NotFound(
        `This phone number does not exist. Please register your account`
      );

    const packages = await packageData(LIST_PACKGE, user.phone);

    let mainProductID = packages.data.Mainproduct;
    // console.log("dddddddd=====>", mainProductID);

    if (packages.data.Err_code === CODE_SUCCESS) {
      if (lang !== undefined) {
        const language = await Languages.findOne({ where: { short: lang } });
        if (!language)
          throw createError.NotFound(
            "Languages not found just the moment. Please choose language supported now."
          );
        if (language.short === _languages.ENGLISH) {
          // english
          const packageSimType = await SimType.findOne({
            where: { mainProduct: mainProductID },
            // Todo: test
            // { mainProduct: 1938385600 },
            include: [
              {
                model: NewPackage,
                where: { catePackage_Id: cate_id },
                required: true,
                as: "newPackages",
                include: [
                  {
                    model: TypePackage,
                    as: "typePackage",
                    include: [{ model: TypePackagTran }],
                  },
                  {
                    model: CatePackage,
                    as: "categoryPackage",
                    include: [{ model: CatePackageTran }],
                  },
                  { model: NewPackageTran },
                ],
              },
            ],
            order: [["newPackages", "id", "DESC"]],
          });
          if (!packageSimType)
            throw createError.NotFound(
              `Package has simTypes mainProductID:${mainProductID} not found`
            );
          return res.json({
            success: true,
            message: `Get package data after login successfully`,
            data: packageSimType,
          });
        }
        // la
        const packageSimType = await SimType.findOne({
          where: { mainProduct: mainProductID },
          // Todo: test
          // { mainProduct: 1938385600 },
          include: [
            {
              model: NewPackage,
              where: { catePackage_Id: cate_id },
              required: true,
              as: "newPackages",
              include: [
                { model: TypePackage, as: "typePackage" },
                { model: CatePackage, as: "categoryPackage" },
              ],
            },
          ],
          order: [["newPackages", "id", "DESC"]],
        });
        if (!packageSimType)
          throw createError.NotFound(
            `Package has simTypes mainProductID:${mainProductID} not found`
          );
        return res.json({
          success: true,
          message: `Get package data after login successfully`,
          data: packageSimType,
        });
      } else {
        // if not defined lang. will set default language
        const packageSimType = await SimType.findOne({
          where: { mainProduct: mainProductID },
          // Todo: test
          // { mainProduct: 1938385600 },
          include: [
            {
              model: NewPackage,
              where: { catePackage_Id: cate_id },
              required: true,
              as: "newPackages",
              include: [
                { model: TypePackage, as: "typePackage" },
                { model: CatePackage, as: "categoryPackage" },
              ],
            },
          ],
          order: [["newPackages", "id", "DESC"]],
        });
        if (!packageSimType)
          throw createError.NotFound(
            `Package has simTypes mainProductID:${mainProductID} not found`
          );
        return res.json({
          success: true,
          message: `Get package data after login successfully`,
          data: packageSimType,
        });
      }
    } else {
      throw createError.BadRequest(`Get list package after login failured!!`);
    }
  } catch (error) {
    next(error);
  }
};

export const listPackageSimTypesAfterLogin_Home = async (req, res, next) => {
  const userInfo = req.user;
  const lang = req.query.lang || req.headers.content_language;
  let limitOption = req.query.limit ? req.query.limit : 4;
  let limitQuery = parseInt(limitOption);
  try {
    // Check user
    const user = await Users.findOne({
      where: { phone: userInfo.phone, status: "active" },
      attributes: ["id", "phone", "status", "createdAt", "updatedAt"],
    });

    if (!user)
      throw createError.NotFound(
        `This phone number does not exist. Please register your account`
      );

    const packages = await packageData(LIST_PACKGE, user.phone);

    let mainProductID = packages.data.Mainproduct;

    if (packages.data.Err_code === CODE_SUCCESS) {
      if (lang !== undefined) {
        const language = await Languages.findOne({ where: { short: lang } });
        if (!language)
          throw createError.NotFound(
            "Languages not found just the moment. Please choose language supported now."
          );
        if (language.short === _languages.ENGLISH) {
          // english

          // find simtype and get package m:m
          const simType = await SimType.findOne({
            where: { mainProduct: mainProductID },
          });
          if (!simType)
            throw createError.NotFound(
              `Package has simTypes mainProductID:${mainProductID} not found`
            );

          const packageSimType = await simType.getNewPackages({
            limit: limitQuery,
            order: [["priority", "ASC"]],
            include: [
              {
                model: TypePackage,
                as: "typePackage",
                include: [{ model: TypePackagTran }],
              },
              {
                model: CatePackage,
                as: "categoryPackage",
                include: [{ model: CatePackageTran }],
              },
              { model: NewPackageTran },
            ],
          });
          if (!packageSimType.length > 0)
            throw createError.NotFound(
              `Simtype ${mainProductID} not has packages.`
            );

          return res.json({
            success: true,
            message: `Get package data after login successfully`,
            data: packageSimType,
          });
        }
        // la
        // find simtype and get package m:m
        const simType = await SimType.findOne({
          where: { mainProduct: mainProductID },
        });
        if (!simType)
          throw createError.NotFound(
            `Package has simTypes mainProductID:${mainProductID} not found`
          );

        const packageSimType = await simType.getNewPackages({
          limit: limitQuery,
          order: [["priority", "ASC"]],
          include: [
            { model: TypePackage, as: "typePackage" },
            { model: CatePackage, as: "categoryPackage" },
          ],
        });
        if (!packageSimType.length > 0)
          throw createError.NotFound(
            `Simtype ${mainProductID} not has packages.`
          );

        return res.json({
          success: true,
          message: `Get package data after login successfully`,
          data: packageSimType,
        });
      } else {
        // if not defined lang. will set default language
        // find simtype and get package m:m
        const simType = await SimType.findOne({
          where: { mainProduct: mainProductID },
        });
        if (!simType)
          throw createError.NotFound(
            `Package has simTypes mainProductID:${mainProductID} not found`
          );

        const packageSimType = await simType.getNewPackages({
          limit: limitQuery,
          order: [["priority", "ASC"]],
          include: [
            { model: TypePackage, as: "typePackage" },
            { model: CatePackage, as: "categoryPackage" },
          ],
        });
        if (!packageSimType.length > 0)
          throw createError.NotFound(
            `Simtype ${mainProductID} not has packages.`
          );

        return res.json({
          success: true,
          message: `Get package data after login successfully`,
          data: packageSimType,
        });
      }
    } else {
      throw createError.BadRequest(`Get list package after login failured!!`);
    }
  } catch (error) {
    next(error);
  }
};

// export const listPackageSimTypes = async (req, res, next) => {
//     const userInfo = req.user;
//     const lang = req.query.lang || req.headers.content_language;
//     try {
//         const user = await Users.findOne({
//             where:
//                 { phone: userInfo.phone, status: 'active' }, attributes: ['id', 'phone', 'status', 'createdAt', 'updatedAt']
//         });

//         if (!user) throw createError.NotFound(`This phone number does not exist. Please register your account`);

//         const packages = await packageData(LIST_PACKGE, user.phone);

//         let mainProductID = packages.data.Mainproduct;
//         console.log("dddddddd=====>", mainProductID);

//         if (packages.data.Err_code === CODE_SUCCESS) {

//             if (lang !== undefined) {
//                 const language = await Languages.findOne({ where: { short: lang } });
//                 if (!language) throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
//                 if (language.short === _languages.ENGLISH) {
//                     // english
//                     const packageSimType = await SimType.findOne({
//                         where:
//                             // { mainProduct: mainProductID },
//                             // Todo: test
//                             { mainProduct: 1938385600 },
//                         include: [
//                             {
//                                 model: NewPackage, where: { typePackage_Id: 2, catePackage_Id: 3 }, as: 'newPackages',
//                                 include: [
//                                     { model: TypePackage, as: 'typePackage', include: [{ model: TypePackagTran }] },
//                                     { model: CatePackage, as: 'categoryPackage', include: [{ model: CatePackageTran }] },
//                                     { model: NewPackageTran }]
//                             }], order: [['newPackages', 'id', 'DESC']]
//                     });
//                     if (!packageSimType) throw createError.NotFound(`Package has simTypes mainProductID:${mainProductID} not found`);
//                     return res.json({
//                         success: true,
//                         message: `Get package data after login successfully`,
//                         data: packageSimType
//                     });
//                 }
//                 // la
//                 const packageSimType = await SimType.findOne({
//                     where:
//                         // { mainProduct: mainProductID },
//                         // Todo: test
//                         { mainProduct: 1938385600 },
//                     include: [
//                         {
//                             model: NewPackage, as: 'newPackages',
//                             include: [{ model: TypePackage, as: 'typePackage' }, { model: CatePackage, as: 'categoryPackage' }]
//                         }], order: [['newPackages', 'id', 'DESC']]
//                 });
//                 if (!packageSimType) throw createError.NotFound(`Package has simTypes mainProductID:${mainProductID} not found`);
//                 return res.json({
//                     success: true,
//                     message: `Get package data after login successfully`,
//                     data: packageSimType
//                 });

//             } else {
//                 // if not defined lang. will set default language
//                 const packageSimType = await SimType.findOne({
//                     where:
//                         // { mainProduct: mainProductID },
//                         // Todo: test
//                         { mainProduct: 1938385600 },
//                     include: [
//                         {
//                             model: NewPackage, as: 'newPackages',
//                             include: [{ model: TypePackage, as: 'typePackage' }, { model: CatePackage, as: 'categoryPackage' }]
//                         }], order: [['newPackages', 'id', 'DESC']]
//                 });
//                 if (!packageSimType) throw createError.NotFound(`Package has simTypes mainProductID:${mainProductID} not found`);
//                 return res.json({
//                     success: true,
//                     message: `Get package data after login successfully`,
//                     data: packageSimType
//                 });

//             }

//         } else {
//             throw createError.BadRequest(`Get list package after login failured!!`);
//         }

//     } catch (error) {
//         next(error);
//     }
// }

/**
 * To refill card phone number
 * @param {* require phone number in use, phone number will be refill and pinNo} req
 * @param {* send data success response} res
 * @param {* if error is true} next
 * @type mothod POST
 * @access private
 */
export const topUpCard = async (req, res, next) => {
  const action = REFILL_CARD; // it means refill card
  const userInfo = req.user;
  const transaction = await sequelize.transaction();
  try {
    const body = await topUpSchema.validateAsync(req.body);

    const user = await Users.findOne(
      {
        where: { phone: userInfo.phone, status: "active" },
        attributes: ["id", "phone", "status", "createdAt", "updatedAt"],
      },
      { transaction: transaction }
    );
    if (!user) {
      throw createError.NotFound(
        `This user does not exist. Please register your account`
      );
    }
    // refill the phone number
    const refill_card = await packageData(
      action,
      user.phone,
      body.telephone,
      body.code
    );

    if (refill_card.data.Err_code === CODE_SUCCESS) {
      await History.create(
        {
          userId: user.id,
          phone: user.phone,
          phoneDestination: body.telephone,
          code: body.code,
        },
        { transaction: transaction }
      );
      await transaction.commit();

      const responseData = await Users.findByPk(user.id, {
        attributes: ["id", "phone", "status", "createdAt", "updatedAt"],
        include: [{ model: History, limit: 1, order: [["id", "DESC"]] }],
      });
      return res.json({
        success: true,
        message: `Refilled your phone number ${body.telephone} successfully`,
        data: responseData,
      });
    } else if (
      refill_card.data.Err_code === 118100155 ||
      refill_card.data.Err_code === 118100140 ||
      refill_card.data.Err_code === 118100142 ||
      refill_card.data.Err_code === 118109004 ||
      refill_card.data.Err_code === 118100143
    ) {
      // TODO: throw message from api Tplus refill_card
      // 118100140:The recharge card is invalid or nonexistent.
      // 118100142:Exceeded the maximum number of recharge failures and the subscriber is added to the recharge blacklist.
      // 118100155:The voucher has been used.
      // 118109004:The service number 2076005343 does not exist.
      throw createError.BadRequest(`${refill_card.data.Desc}`);
    } else {
      // * TODO: throw message something went wrong this refill card.
      // * Because Err_code = null
      throw createError.RequestTimeout(`${refill_card.data.Desc}`);
    }
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    await transaction.rollback();
    next(error);
  }
};

/**
 * client --> To register package data
 * @param {* require data from body} req
 * @param {* send data success response} res
 * @param {* if error is true} next
 * @type mothod POST
 * @access private
 * @returns
 */
export const registerPackge = async (req, res, next) => {
  const action = REGISTER_PACKGE; //  it means register package data
  const userInfo = req.user;
  const transaction = await sequelize.transaction();
  try {
    const body = await registerPackgeSchema.validateAsync(req.body);

    const user = await Users.findOne(
      {
        where: { phone: userInfo.phone, status: "active" },
        attributes: ["id", "phone", "status", "createdAt", "updatedAt"],
      },
      { transaction: transaction }
    );
    if (!user) {
      throw createError.NotFound(
        `This phone number ${userInfo.phone} does not exist`
      );
    }
    // Todo: register package data
    const register = await packageData(
      action,
      userInfo.phone,
      body.telephone,
      body.code
    );

    if (register.data.Err_code === CODE_SUCCESS) {
      await History.create(
        {
          userId: user.id,
          type: "registerPackage",
          phone: user.phone,
          phoneDestination: body.telephone,
          code: body.code,
          value: body.pname,
        },
        { transaction: transaction }
      );
      await transaction.commit();

      const responseData = await Users.findByPk(user.id, {
        attributes: ["id", "phone", "status", "createdAt", "updatedAt"],
        include: [{ model: History, limit: 1, order: [["id", "DESC"]] }],
      });

      return res.json({
        success: true,
        message: `Registration package data phone number ${body.telephone}  successfully registered`,
        data: responseData,
      });
    } else if (
      register.data.Err_code === 3001 ||
      register.data.Err_code === "0016" ||
      register.data.Err_code === 2021 ||
      register.data.Err_code === "0014" ||
      register.data.Err_code === 2000 ||
      register.data.Err_code === 1012 ||
      register.data.Err_code === 2060 ||
      register.data.Err_code === 16
    ) {
      // throw message from api Tplus register package
      // 16:This number is not have in list promotion.
      // 2060:Object reference not set to an instance of an object.
      // 1012:Incorrect package type.
      // 2000:VSMP-06010756::Unable to Add Counter
      // 1000:Operation successed.
      // 0014:Incorrect Package Code.
      // 2021:The request failed with HTTP status 503: Service Unavailable.
      // 0016:This number is not have in list promotion.
      // 3001Balance is not enough.
      throw createError.BadRequest(`${register.data.Desc}`);
    } else {
      // * TODO: throw message something went wrong register package.
      // * Because Err_code = null
      throw createError.RequestTimeout(`${register.data.Desc}`);
    }
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    await transaction.rollback();
    next(error);
  }
};

/**
 * client --> To transfer balance
 * @param {* require telephone destination and amount to transfer} req
 * @param {* send data success response} res
 * @param {* if error is true} next
 * @type mothod POST
 * @access private
 * @returns
 */
export const transferBalance = async (req, res, next) => {
  const userInfo = req.user;
  const transaction = await sequelize.transaction();
  try {
    const body = await transferUpSchema.validateAsync(req.body);

    const user = await Users.findOne(
      {
        where: { phone: userInfo.phone, status: "active" },
        attributes: ["id", "phone", "status", "createdAt", "updatedAt"],
      },
      { transaction: transaction }
    );
    if (!user)
      throw createError.NotFound(
        `This phone number does not exist. Please register your account`
      );

    // Todo: transfer balance
    const transfer = await packageData(
      TRANSFER_BALANCE,
      user.phone,
      body.telephone,
      body.code
    );

    if (transfer.data.Err_code === CODE_SUCCESS) {
      await History.create(
        {
          userId: user.id,
          type: "transfer",
          phone: user.phone,
          phoneDestination: body.telephone,
          value: body.code,
        },
        { transaction: transaction }
      );
      await transaction.commit();

      const responseData = await Users.findByPk(user.id, {
        attributes: ["id", "phone", "status", "createdAt", "updatedAt"],
        include: [{ model: History, limit: 1, order: [["id", "DESC"]] }],
      });

      return res.json({
        success: true,
        message: `Transfer balance from phone number ${user.phone} to ${body.telephone} is ${body.code}₭ successfully.`,
        data: responseData,
      });
    } else if (transfer.data.Err_code === 7 || transfer.data.Err_code === 3) {
      // todo: throw message from api Tplus transfer balance
      // 3:Incorrect msisdn.
      // 7:Balance not enough.
      throw createError.BadRequest(`${transfer.data.Desc}`);
    } else {
      // * TODO: throw message something went wrong transfer balance.
      // * Because Err_code = null
      throw createError.RequestTimeout(`${transfer.data.Desc}`);
    }
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    await transaction.rollback();
    next(error);
  }
};
