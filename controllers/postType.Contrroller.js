import {
    PostTypes,
    PostTypesTran,
    Languages,
    Post,
    PostTran,
    PostImage,
    PostImageTran,
    sequelize
} from '../models';
import { Op } from 'sequelize';
import createError from 'http-errors';
import { makeSlugify } from '../libs/utils/regex';
import _languages from '../constants/language';
import {
    addPostTypeSchema,
    updatePrioritySchema,
    updatePostTyepSchema,
} from '../validators/postType.validator';

/**
 * To create a new post Type
 * @param {*require data from request} req 
 * @param {*send data success response} res 
 * @param {*if send data error} next 
 * @type mothod POST
 * @access private
 * @returns 
 */
export const createPostType = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const body = await addPostTypeSchema.validateAsync(req.body);
        const slug = makeSlugify(body.name);
        const slugTran = makeSlugify(body.other_lang[0].name);
        // check postType
        const postType = await PostTypes.findOne({ where: { name: body.name } }, { transaction: transaction });
        if (postType) {
            await transaction.rollback();
            return res.status(200).json({ success: false, message: `This post type: ${body.name} is already exists` });
        }
        const postTypeTran = await PostTypesTran.findOne({ where: { name: body.other_lang[0].name } }, { transaction: transaction });
        if (postTypeTran) {
            await transaction.rollback();
            return res.status(200).json({ success: false, message: `This post type tran: ${body.other_lang[0].name} is already exists` });
        }
        const lang = await Languages.findByPk(body.other_lang[0].language_id, { transaction: transaction });
        if (!lang) {
            throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
        }
        //find last priority
        // const postTypeLastPriority = await PostTypes.findAll({ limit: 1, order: sequelize.literal('priority DESC') }, { transaction: transaction });


        // create post type 
        const newPostType = await PostTypes.create({
            name: body.name,
            // priority: postTypeLastPriority[0] ? postTypeLastPriority[0].priority + 1 : 1, // first db not data use 1 after use postTypeLastPriority[0].priority + 1
            is_active: 'true',
            slug: slug
        }, { transaction: transaction });

        await PostTypesTran.create({
            postTypeId: newPostType.id,
            languageId: body.other_lang[0].language_id,
            name: body.other_lang[0].name,
            slug: slugTran
        }, { transaction: transaction });
        await transaction.commit();

        const responseData = await PostTypes.findByPk(newPostType.id, {
            include: [{ model: PostTypesTran, as: 'PostTypesTrans' }]
        });

        return res.json({
            success: true,
            message: "Created post type successfully",
            data: responseData,
        });
    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        await transaction.rollback();
        next(error);
    }
}

/**
 * To update one post Type
 * @param {*require id and data from request} req 
 * @param {*send data success response} res 
 * @param {*if send data error} next 
 * @type mothod POST
 * @access private
 * @returns 
 */
export const updatePostType = async (req, res, next) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();
    try {
        const body = await updatePostTyepSchema.validateAsync(req.body);

        const slug = makeSlugify(body.name);
        const slugTran = makeSlugify(body.other_lang[0].name);

        // check if unique post type
        const uniquePostType = await PostTypes.findAll({ where: { name: body.name, id: { [Op.ne]: id } } });
        if (uniquePostType[0]) throw createError.BadRequest(`This post type ${body.name} is already taken`);

        // check if unique post type trans
        const uniquePostTypeTran = await PostTypesTran.findAll({ where: { name: body.other_lang[0].name, postTypeId: { [Op.ne]: id } } });
        if (uniquePostTypeTran[0]) throw createError.BadRequest(`This post type tran ${body.other_lang[0].name} is already taken`);

        // check if postType
        const postType = await PostTypes.findByPk(id, {
            include:
                [{ model: PostTypesTran, as: 'PostTypesTrans' }]
        }, { transaction: transaction });

        if (!postType) {
            throw createError.NotFound(`Post type not found. with ID:${id}`);
        }
        postType.name = body.name;
        postType.is_active = body.is_active;
        postType.slug = slug;
        await postType.save();

        await PostTypesTran.update({
            name: body.other_lang[0].name,
            slug: slugTran
        }, { where: { id: postType.PostTypesTrans[0].id, languageId: postType.PostTypesTrans[0].languageId } }, { transaction: transaction });
        await transaction.commit();

        const responseData = await PostTypes.findByPk(id, { include: [{ model: PostTypesTran, as: 'PostTypesTrans' }] });

        return res.json({
            success: true,
            message: `Updated post type ID:${id} successfully`,
            data: responseData
        });
    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        await transaction.rollback();
        next(error);
    }
}

/**
 * To update priority in post types
 * @param {*require data from body} req 
 * @param {*send data success response} res 
 * @param {*if error is true} next 
 * @type mothod POST
 * @access private
 * @returns 
 */
// export const updatePriorty = async (req, res, next) => {
//     const transaction = await sequelize.transaction();
//     try {
//         const body = await updatePrioritySchema.validateAsync(req.body);

//         // update priority
//         await Promise.all(body.map(async (item, index) => {
//             let idx = index + 1;
//             await PostTypes.update({ priority: idx }, { where: { name: item.priority } }, { transaction: transaction });
//         }));
//         await transaction.commit();

//         const responseData = await PostTypes.findAll({
//             where:
//                 { is_active: true }, attributes: ['id', 'name', 'priority', 'is_active'], order: sequelize.literal('priority ASC'), include: [{ model: PostTypesTran, as: 'PostTypesTrans' }],
//         });

//         return res.json({
//             success: true,
//             message: `Updated priority success`,
//             data: responseData
//         });
//     } catch (error) {
//         if (error.isJoi === true) error.status = 422;
//         await transaction.rollback();
//         next(error);
//     }
// }

/**
 * admin --> To get all post Type 
 * @param {*require language from request headers} req 
 * @param {*send data success response} res 
 * @param {*if send data error} next 
 * @type mothod GET
 * @access public
 * @returns 
 */
export const findPostType_Ad = async (req, res, next) => {
    const lang = req.query.lang || req.headers.content_language;
    try {
        const language = await Languages.findOne({ where: { short: lang } });

        if (!language) {
            throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
        }
        if (language.short === _languages.ENGLISH) {
            // eng
            const postType = await PostTypes.findAll({ include: [{ model: PostTypesTran, as: 'PostTypesTrans' }], order: [['id', 'DESC']] });
            return res.json({
                success: true,
                message: "Get all post types english language",
                data: postType
            });
        }
        // la
        const postType = await PostTypes.findAll({ order: [['id', 'DESC']] });
        return res.json({
            success: true,
            message: "Get all post types lao language",
            data: postType
        });

    } catch (error) {
        next(error);
    }
}

export const findPostType_Cli = async (req, res, next) => {
    const lang = req.query.lang || req.headers.content_language;
    try {
        const language = await Languages.findOne({ where: { short: lang } });

        if (!language) {
            throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
        }
        if (language.short === _languages.ENGLISH) {
            // eng
            const postType = await PostTypes.findAll({
                where:
                    { is_active: true }, include: [{ model: PostTypesTran, as: 'PostTypesTrans' }], order: [['id', 'DESC']]
            });
            return res.json({
                success: true,
                message: "Get all post types english language",
                data: postType
            });
        }
        // la
        const postType = await PostTypes.findAll({ where: { is_active: true }, order: [['id', 'DESC']] });
        return res.json({
            success: true,
            message: "Get all post types lao language",
            data: postType
        });

    } catch (error) {
        next(error);
    }
}

/**
 * To get one post Type
 * @param {*require id and language from request and headers} req 
 * @param {*send data success response} res 
 * @param {*if send data error} next 
 * @type mothod GET
 * @access public
 * @returns 
 */
export const findOnePostType = async (req, res, next) => {
    const { id } = req.params;
    const lang = req.query.lang || req.headers.content_language;
    try {
        const language = await Languages.findOne({ where: { short: lang } });
        if (!language) {
            throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
        }
        if (language.short === _languages.ENGLISH) {
            // eng
            const postType = await PostTypes.findByPk(id, { include: [{ model: PostTypesTran, as: 'PostTypesTrans' }] });
            if (!postType) {
                throw createError.NotFound(`Post type not found. with ID:${id}`);
            }
            return res.json({
                success: true,
                message: "Get a post type english language successfully",
                data: postType
            });
        }
        const postType = await PostTypes.findByPk(id);
        if (!postType) {
            throw createError.NotFound(`Post type not found. with ID:${id}`);
        }
        return res.json({
            success: true,
            message: "Get a post type lao language successfully",
            data: postType
        });
    } catch (error) {
        next(error);
    }
}

/**
 * To get all priority in post types
 * @param {* require language from request} req 
 * @param {* send data success response} res 
 * @param {* if error is true} next 
 * @type mothod GET
 * @access public
 * @returns 
 */
// not use
export const findPostTypePriority = async (req, res, next) => {
    const lang = req.query.lang || req.headers.content_language;
    try {
        const language = await Languages.findOne({ where: { short: lang } });

        if (!language) {
            throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
        }
        if (language.short === _languages.ENGLISH) {
            const postType = await PostTypes.findAll({
                where:
                    { is_active: true }, attributes: ['id', 'name', 'priority', 'is_active'], order: sequelize.literal('priority ASC'), include: [{ model: PostTypesTran, as: 'PostTypesTrans', }],
            });
            // if (!postType[0]) {
            //     throw createError.NotFound(`Now. post type empty`);
            // }
            return res.json({
                success: true,
                message: "Priority English",
                data: postType
            });
        }
        // la
        const postType = await PostTypes.findAll({
            where:
                { is_active: true }, attributes: ['id', 'name', 'priority', 'is_active'], order: sequelize.literal('priority ASC'),
        });
        if (!postType[0]) {
            throw createError.NotFound(`Now. post type empty`);
        }
        return res.json({
            success: true,
            message: "Priority Lao",
            data: postType
        });

    } catch (error) {
        next(error);
    }
}

/**
 * To get all priority in post types for client
 * @param {* require language from request} req 
 * @param {* send data success response} res 
 * @param {* if error is true} next 
 * @type mothod GET
 * @access public
 * @returns 
 */
// not use
export const findPostTypePriorities = async (req, res, next) => {
    const lang = req.query.lang || req.headers.content_language;
    try {
        const language = await Languages.findOne({ where: { short: lang } });

        if (!language) {
            throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
        }
        if (language.short === _languages.ENGLISH) {
            const postType = await PostTypes.findAll({
                where:
                    { is_active: true }, attributes: ['id', 'name', 'priority', 'is_active'], order: sequelize.literal('priority ASC'),
                include: [{ model: PostTypesTran, as: 'PostTypesTrans' },
                {
                    model: Post, where: {
                        status: 'open', startDate: { [Op.lt]: Date.now() }, endDate: { [Op.gt]: Date.now() }
                    }, include: [{ model: PostTran }, { model: PostImage }, { model: PostImageTran },]
                }],  //  include: [{ model: PostTran }, { model: PostImage }, { model: PostImageTran },]
            });
            if (!postType[0]) {
                throw createError.NotFound(`Now. post type empty`);
            }
            return res.json({
                success: true,
                message: "Priority English",
                data: postType
            });
        }
        // la
        const postType = await PostTypes.findAll({
            where:
                { is_active: true }, attributes: ['id', 'name', 'priority', 'is_active'], order: sequelize.literal('priority ASC'),
        });
        if (!postType[0]) {
            throw createError.NotFound(`Now. post type empty`);
        }
        return res.json({
            success: true,
            message: "Priority Lao",
            data: postType
        });

    } catch (error) {
        next(error);
    }
}

/**
 * To get a post types
 * @param {* require id and language from request} req 
 * @param {* send data success response} res 
 * @param {* if error is true} next 
 * @type mothod GET
 * @access public
 * @returns 
 */
// export const findPostTypeByslug = async (req, res, next) => {
//     const { id } = req.params;
//     const lang = req.query.lang || req.headers.content_language;
//     try {
//         const language = await Languages.findOne({ where: { short: lang } });
//         if (!language) {
//             throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
//         }
//         if (language.short === _languages.ENGLISH) {
//             // eng
//             let postType = await PostTypes.findOne({
//                 where: { slug: id, is_active: true },
//                 include: [{ model: PostTypesTran, as: 'PostTypesTrans' }]
//             });

//             if (!postType) {

//                 postType = await PostTypes.findOne({

//                     include: [{ model: PostTypesTran, where: { slug: id }, required: true, as: 'PostTypesTrans' }]
//                 });

//                 if (!postType) throw createError.NotFound(`Post type not found. with ID:${id}`);
//             }
//             return res.json({
//                 success: true,
//                 message: "Get a post type english language successfully",
//                 data: postType
//             });
//         }
//         // la
//         const postType = await PostTypes.findOne({ where: { slug: id } });
//         if (!postType) {
//             throw createError.NotFound(`Post type not found. with ID:${id}`);
//         }
//         return res.json({
//             success: true,
//             message: "Get a post type lao language successfully",
//             data: postType
//         });
//     } catch (error) {
//         next(error);
//     }
// }

export const findPostTypeByslug = async (req, res, next) => {
    const { id } = req.params;
    const lang = req.query.lang || req.headers.content_language;
    try {
        const language = await Languages.findOne({ where: { short: lang } });
        if (!language) {
            throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
        }
        if (language.short === _languages.ENGLISH) {
            // eng
            let postType = await PostTypes.findAll({
                where: { slug: id, is_active: true },
                include: [{ model: PostTypesTran, as: 'PostTypesTrans' },
                { model: Post, separate: true, order: [['id', 'DESC']], where: { status: 'open' }, include: [{ model: PostTran }, { model: PostImage }, { model: PostImageTran }] }]
            });

            if (!postType[0]) {

                postType = await PostTypes.findAll({
                    include: [{ model: PostTypesTran, where: { slug: id }, required: true, as: 'PostTypesTrans' },
                    { model: Post, separate: true, order: [['id', 'DESC']], where: { status: 'open' }, include: [{ model: PostTran }, { model: PostImage }, { model: PostImageTran }] }]
                });

                if (!postType[0]) throw createError.NotFound(`Post type not found. with ID:${id}`);
            }
            return res.json({
                success: true,
                message: "Get a post type english language successfully",
                data: postType
            });
        }
        // la
        const postType = await PostTypes.findAll({
            where: { slug: id, is_active: true },
            include: [
                { model: Post, separate: true, order: [['id', 'DESC']], where: { status: 'open' }, include: [{ model: PostImage }] }]
        });
        if (!postType[0]) {
            throw createError.NotFound(`Post type not found. with ID:${id}`);
        }
        return res.json({
            success: true,
            message: "Get a post type lao language successfully",
            data: postType
        });
    } catch (error) {
        next(error);
    }
}

/**
 * To create a new post Type
 * @param {*require data from request} req 
 * @param {*send data success response} res 
 * @param {*if send data error} next 
 * @type mothod POST
 * @access private
 * @returns 
 */
export const deletePostType = async (req, res, next) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();
    try {
        const posts = await Post.findAll({ where: { postTypeId: id } }, { transaction: transaction });
        if (posts.length > 0) {
            throw createError.BadRequest(`Unable to delete ID:${id} at this time. Because the posts table is active`);
        }
        const postType = await PostTypes.findByPk(id, { transaction: transaction });
        if (!postType) {
            throw createError.NotFound(`Post type not found. with ID:${id}`);
        }

        await PostTypesTran.destroy({ where: { postTypeId: id } }, { transaction: transaction });
        await postType.destroy();
        await transaction.commit();
        return res.json({
            success: true,
            message: `Deleted post type ID:${id} successfully`,
        });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}