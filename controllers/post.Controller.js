import {
    Post,
    PostTran,
    PostImage,
    PostImageTran,
    NewsCategory,
    NewsCategoryTran,
    NewsCategoryPost,
    Languages,
    PostTypes,
    PostTypesTran,
    JobRecuit,
    sequelize
} from '../models';
import { Op } from 'sequelize';
import createError from 'http-errors';
import _languages from '../constants/language';
import { makeSlugify } from '../libs/utils/regex';
import { DOMAIN } from '../constants/index';
import {
    addPostSchema,
    updatePostSchema
} from '../validators/post.validator';

/**
 * To create a new post 
 * @param {require data from request body} req 
 * @param {*send data success response} res 
 * @param {*if error is true} next 
 * @type mothod POST
 * @access private
 * @returns 
 */
export const createPost = async (req, res, next) => {
    const { files } = req;
    const transaction = await sequelize.transaction();
    try {
        const body = await addPostSchema.validateAsync(req.body);

        const slug = makeSlugify(body.title);
        const slugTran = makeSlugify(body.other_lang[0].title);
        // Check post
        const post = await Post.findOne({ where: { title: body.title } }, { transaction: transaction });
        if (post) {
            await transaction.rollback();
            return res.status(200).json({ success: false, message: `This post title:${body.title} is already exists` });
        }
        // Check post tran
        const postTran = await PostTran.findOne({ where: { title: body.other_lang[0].title } }, { transaction: transaction });
        if (postTran) {
            await transaction.rollback();
            return res.status(200).json({ success: false, message: `This post tran title:${body.other_lang[0].title} is already exists` });
        }
        // Check post type
        const postType = await PostTypes.findByPk(body.postTypeId, { transaction: transaction });
        if (!postType) {
            throw createError.NotFound(`Post type not found. with ID:${body.postTypeId}`);
        }
        // Check lang
        const lang = await Languages.findByPk(body.other_lang[0].language_id, { transaction: transaction });
        if (!lang) {
            throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
        }

        if (!files[0]) {
            let imageUrl = `${DOMAIN}/images/defaultPost.png`;

            const newPost = await Post.create({
                postTypeId: postType.id,
                title: body.title,
                description: body.description,
                status: body.status ? body.status : 'close',
                startDate: body.startDate ? body.startDate : Date.now(),
                endDate: body.endDate ? body.endDate : null,
                slug: slug,
            }, { transaction: transaction });

            await PostTran.create({
                postId: newPost.id,
                languageId: body.other_lang[0].language_id,
                title: body.other_lang[0].title,
                description: body.other_lang[0].description,
                slug: slugTran
            }, { transaction: transaction });

            await PostImage.create({
                postId: newPost.id,
                image: imageUrl
            }, { transaction: transaction });

            await PostImageTran.create({
                postId: newPost.id,
                languageId: body.other_lang[0].language_id,
                image: imageUrl,
            }, { transaction: transaction });

            // insert new category
            await Promise.all(body.newsCategoryId.filter((item) => !!item)
                .map(async (item) => {
                    await NewsCategoryPost.create({
                        newsCategoryId: item,
                        postId: newPost.id,
                    }, { transaction: transaction });
                }));

            await transaction.commit();

            const responseData = await Post.findByPk(newPost.id, {
                include:
                    [{ model: PostTran, as: 'PostTrans' },
                    { model: PostImage, as: 'PostImages' },
                    { model: PostImageTran, as: 'PostImageTrans' },
                    { model: NewsCategory, as: 'newsCategories', include: [{ model: NewsCategoryTran }] }]
            });

            return res.json({
                success: true,
                message: `Created new post title:${body.title} successfully`,
                data: responseData
            });

        } else {

            let imageUrl = []
            files.filter(file => file.fieldname == 'avatar[]')
                .forEach((fn) => {
                    imageUrl.push(`${DOMAIN}/images/post-images/${fn.filename}`);
                });

            let imageUrlTran = []
            files.filter(file => file.fieldname == 'avatar_EN[]')
                .forEach((fn) => {
                    imageUrlTran.push(`${DOMAIN}/images/post-images/${fn.filename}`);
                });

            const newPost = await Post.create({
                postTypeId: postType.id,
                title: body.title,
                description: body.description,
                status: body.status ? body.status : 'close',
                startDate: body.startDate ? body.startDate : Date.now(),
                endDate: body.endDate ? body.endDate : null,
                slug: slug,
            }, { transaction: transaction });

            await PostTran.create({
                postId: newPost.id,
                languageId: body.other_lang[0].language_id,
                title: body.other_lang[0].title,
                description: body.other_lang[0].description,
                slug: slugTran
            }, { transaction: transaction });

            await Promise.all(imageUrl.map(async (item) => {
                await PostImage.create({ postId: newPost.id, image: item }, { transaction: transaction });
            }));

            await Promise.all(imageUrlTran.map(async (item) => {
                await PostImageTran.create({
                    postId: newPost.id,
                    languageId: body.other_lang[0].language_id,
                    image: item,
                }, { transaction: transaction });
            }));

            // insert new category
            await Promise.all(body.newsCategoryId.filter((item) => !!item)
                .map(async (item) => {
                    await NewsCategoryPost.create({
                        newsCategoryId: item,
                        postId: newPost.id,
                    }, { transaction: transaction });
                }));

            await transaction.commit();

            const responseData = await Post.findByPk(newPost.id, {
                include:
                    [{ model: PostTran, as: 'PostTrans' },
                    { model: PostImage, as: 'PostImages' },
                    { model: PostImageTran, as: 'PostImageTrans' },
                    { model: NewsCategory, as: 'newsCategories', include: [{ model: NewsCategoryTran }] }],
            });

            return res.json({
                success: true,
                message: `Created new post title:${body.title} successfully`,
                data: responseData,
            });
        }

    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        await transaction.rollback();
        next(error);
    }
}

/**
 * To update the post 
 * @param {require if and data from request} req 
 * @param {*send data success response} res 
 * @param {*if error is true} next 
 * @type mothod PUT
 * @access private
 * @returns 
 */
export const updatePost = async (req, res, next) => {
    const { id } = req.params;
    const { files } = req;
    const transaction = await sequelize.transaction();
    try {
        const body = await updatePostSchema.validateAsync(req.body);
        const slug = makeSlugify(body.title);
        const slugTran = makeSlugify(body.other_lang[0].title);

        // check unique post 
        const uniquePost = await Post.findAll({ where: { title: body.title, id: { [Op.ne]: id } } });
        if (uniquePost[0]) throw createError.BadRequest(`This post ${body.title} already taken`);

        // check unique postTran 
        const uniquePostTran = await PostTran.findAll({ where: { title: body.other_lang[0].title, postId: { [Op.ne]: id } } });
        if (uniquePostTran[0]) throw createError.BadRequest(`This post tran ${body.other_lang[0].title} already taken`);

        // Check post
        const post = await Post.findByPk(id, { transaction: transaction });
        if (!post) {
            throw createError.NotFound(`This post does not exist. with ID:${id}`);
        }
        const lang = await Languages.findByPk(body.other_lang[0].language_id, { transaction: transaction });
        if (!lang) {
            throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
        }

        if (!files[0]) {

            post.title = body.title;
            post.description = body.description;
            post.status = body.status ? body.status : 'close';
            post.startDate = body.startDate ? body.startDate : post.startDate;
            post.endDate = body.endDate ? body.endDate : post.endDate;
            post.slug = slug;
            await post.save();

            await PostTran.update({
                title: body.other_lang[0].title,
                description: body.other_lang[0].description,
                slug: slugTran,
            }, { where: { postId: id, languageId: lang.id } }, { transaction: transaction });

            // clear & insert new category
            await NewsCategoryPost.destroy({ where: { postId: id } }, { transaction: transaction });
            await Promise.all(body.newsCategoryId.filter((item) => !!item)
                .map(async (item) => {
                    await NewsCategoryPost.create({
                        newsCategoryId: item,
                        postId: post.id,
                    }, { transaction: transaction });
                }));

            await transaction.commit();

            const responseData = await Post.findByPk(id, {
                include:
                    [{ model: PostTran, as: 'PostTrans' },
                    { model: PostImage, as: 'PostImages' },
                    { model: PostImageTran, as: 'PostImageTrans' },
                    { model: NewsCategory, as: 'newsCategories', include: [{ model: NewsCategoryTran }] }]
            });

            return res.json({
                success: true,
                message: `Updated post ID:${id} successfully`,
                data: responseData
            });

        } else {

            let imageUrl = []
            files.filter(file => file.fieldname == 'avatar[]')
                .forEach((fn) => {
                    imageUrl.push(`${DOMAIN}/images/post-images/${fn.filename}`);
                });

            let imageUrlTran = []
            files.filter(file => file.fieldname == 'avatar_EN[]')
                .forEach((fn) => {
                    imageUrlTran.push(`${DOMAIN}/images/post-images/${fn.filename}`);
                });

            post.title = body.title;
            post.description = body.description;
            post.status = body.status ? body.status : 'close';
            post.startDate = body.startDate ? body.startDate : post.startDate;
            post.endDate = body.endDate ? body.endDate : post.endDate;
            post.slug = slug;
            await post.save();

            await PostTran.update({
                title: body.other_lang[0].title,
                description: body.other_lang[0].description,
                slug: slugTran,
            }, { where: { postId: id, languageId: lang.id } }, { transaction: transaction });

            await PostImage.destroy({ where: { postId: id } }, { transaction: transaction });
            await PostImageTran.destroy({ where: { postId: id, languageId: lang.id } }, { transaction: transaction });

            await Promise.all(imageUrl.map(async (item) => {
                await PostImage.create({ postId: id, image: item }, { transaction: transaction });
            }));

            await Promise.all(imageUrlTran.map(async (item) => {
                await PostImageTran.create({
                    postId: id,
                    languageId: lang.id,
                    image: item
                }, { transaction: transaction });
            }));

            await NewsCategoryPost.destroy({ where: { postId: id } }, { transaction: transaction });
            // insert new category
            await Promise.all(body.newsCategoryId.filter((item) => !!item)
                .map(async (item) => {
                    await NewsCategoryPost.create({
                        newsCategoryId: item,
                        postId: post.id,
                    }, { transaction: transaction });
                }));

            await transaction.commit();

            const responseData = await Post.findByPk(id, {
                include:
                    [{ model: PostTran, as: 'PostTrans' },
                    { model: PostImage, as: 'PostImages' },
                    { model: PostImageTran, as: 'PostImageTrans' },
                    { model: NewsCategory, as: 'newsCategories', include: [{ model: NewsCategoryTran }] }]
            });
            return res.json({
                success: true,
                message: `Updated post ID:${id} successfully`,
                data: responseData
            });
        }

    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        await transaction.rollback();
        next(error);
    }
}

/**
 * To get all post 
 * @param {require language from request} req 
 * @param {*send data success response} res 
 * @param {*if error is true} next 
 * @type mothod GET
 * @access public
 * @returns 
 */
export const findPost = async (req, res, next) => {
    const lang = req.query.lang || req.headers.content_language;
    try {
        const language = await Languages.findOne({ where: { short: lang } });
        if (!language) {
            throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
        }
        if (language.short === _languages.ENGLISH) {
            // eng
            const post = await Post.findAll({
                include:
                    [{ model: PostTran, as: 'PostTrans' },
                    { model: PostImage, as: 'PostImages' },
                    { model: PostImageTran, as: 'PostImageTrans' },
                    { model: NewsCategory, as: 'newsCategories', include: [{ model: NewsCategoryTran }] }], order: [['id', 'DESC']]
            });
            if (!post) {
                throw createError.NotFound("Post not found");
            }
            return res.json({
                success: true,
                message: "Get all post successfully",
                data: post,
            });
        }
        // la
        const post = await Post.findAll({
            include:
                [{ model: PostImage, as: 'PostImages' }, { model: NewsCategory, as: 'newsCategories', }], order: [['id', 'DESC']]
        });
        if (!post) {
            throw createError.NotFound("Post not found");
        }
        return res.json({
            success: true,
            message: "Get all post successfully",
            data: post,
        });

    } catch (error) {
        next(error);
    }
}

export const findPost_Cli = async (req, res, next) => {
    const lang = req.query.lang || req.headers.content_language;
    try {
        const language = await Languages.findOne({ where: { short: lang } });
        if (!language) {
            throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
        }
        if (language.short === _languages.ENGLISH) {
            // eng
            const post = await Post.findAll({
                where: { status: 'open' },
                include:
                    [{ model: PostTran, as: 'PostTrans' },
                    { model: PostImage, as: 'PostImages' },
                    { model: PostImageTran, as: 'PostImageTrans' },
                    { model: NewsCategory, as: 'newsCategories', include: [{ model: NewsCategoryTran }] }], order: [['id', 'DESC']]
            });

            return res.json({
                success: true,
                message: "Get all post successfully",
                data: post,
            });
        }
        // la
        const post = await Post.findAll({
            where: { status: 'open' },
            include:
                [{ model: PostImage, as: 'PostImages' }], order: [['id', 'DESC']]
        });

        return res.json({
            success: true,
            message: "Get all post successfully",
            data: post,
        });

    } catch (error) {
        next(error);
    }
}

/**
 * To get post by status,
 * @param {require language from request} req 
 * @param {*send data success response} res 
 * @param {*if error is true} next 
 * @type mothod GET
 * @access public
 * @returns 
 */
export const findPostStatus = async (req, res, next) => {
    const lang = req.query.lang || req.headers.content_language;
    try {
        const language = await Languages.findOne({ where: { short: lang } });
        if (!language) {
            throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
        }
        if (language.short === _languages.ENGLISH) {
            // eng
            const post = await Post.findAll({
                where: { status: 'open' },
                include:
                    [{ model: PostTran, as: 'PostTrans' },
                    { model: PostImage, as: 'PostImages' },
                    { model: PostImageTran, as: 'PostImageTrans' }]
            });
            if (!post) {
                throw createError.NotFound("Post not found");
            }
            return res.json({
                success: true,
                message: "Get all post for english successfully",
                data: post,
            });
        }
        // la
        const post = await Post.findAll({
            where: { status: 'open' },
            include:
                [{ model: PostImage, as: 'PostImages' }]
        });
        if (!post) {
            throw createError.NotFound("Post not found");
        }
        return res.json({
            success: true,
            message: "Get all post successfully",
            data: post,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * To get one post 
 * @param {require id and language from request} req 
 * @param {*send data success response} res 
 * @param {*if error is true} next 
 * @type mothod GET
 * @access public
 * @returns 
 */
export const findOnePost = async (req, res, next) => {
    const { id } = req.params;
    const lang = req.query.lang || req.headers.content_language;
    try {
        const language = await Languages.findOne({ where: { short: lang } });
        if (!language) {
            throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
        }
        if (language.short === _languages.ENGLISH) {
            const post = await Post.findByPk(id, {
                include:
                    [{ model: PostTran, as: 'PostTrans' },
                    { model: PostImage, as: 'PostImages' },
                    { model: PostImageTran, as: 'PostImageTrans' },
                    { model: NewsCategory, as: 'newsCategories', include: [{ model: NewsCategoryTran }] }]
            });
            if (!post) {
                throw createError.NotFound(`Post does not exist. with ID:${id}`);
            }
            return res.json({
                success: true,
                message: "Get one post for english successfully",
                data: post
            });
        }

        const post = await Post.findByPk(id, {
            include:
                [{ model: PostImage, as: 'PostImages' }]
        });
        if (!post) {
            throw createError.NotFound(`Post does not exist. with ID:${id}`);
        }
        return res.json({
            success: true,
            message: "Get one post for lao successfully",
            data: post
        });
    } catch (error) {
        next(error);
    }
}

/**
 * admin --> To get all data promotion
 * @param {* require language from request} req 
 * @param {* send data success response} res 
 * @param {* if error is true} next 
 * @type mothod GET
 * @access public
 * @returns 
 */
export const findAllPostPromotions = async (req, res, next) => {
    const lang = req.query.lang || req.headers.content_language;
    try {
        const language = await Languages.findOne({ where: { short: lang } });
        if (!language) {
            throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
        }

        if (language.short === _languages.ENGLISH) {
            // eng
            const promotions_EN = await PostTypes.findAll({
                where:
                    { name: 'ໂປຣໂມຊັນ' },
                include: [{ model: PostTypesTran },
                {
                    model: Post, separate: true,
                    order: [['id', 'desc']], include: [{ model: PostTran, separate: true, }, { model: PostImage, separate: true, }, { model: PostImageTran, separate: true, }]
                }]
            });

            return res.json({
                success: true,
                message: 'Get all data promotion english language successfully',
                data: promotions_EN,
            });

        } else {
            // la
            const promotions_LA = await PostTypes.findAll({
                where:
                    { name: 'ໂປຣໂມຊັນ' },
                include: [
                    {
                        model: Post, separate: true,
                        order: [['id', 'DESC']], include: [{ model: PostImage, separate: true, }]
                    }]
            });

            return res.json({
                success: true,
                message: 'Get all data promotion lao language successfully',
                data: promotions_LA,
            });
        }

    } catch (error) {
        next(error);
    }
}

/**
 * admin --> To get all data post news 
 * @param {* require language from request} req 
 * @param {* send data success response} res 
 * @param {* if error is true} next 
 * @type mothod GET
 * @access public
 * @returns 
 */
export const findAllPostNews = async (req, res, next) => {
    const lang = req.query.lang || req.headers.content_language;
    try {
        const language = await Languages.findOne({ where: { short: lang } });
        if (!language) {
            throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
        }

        if (language.short === _languages.ENGLISH) {
            // eng
            const news_EN = await PostTypes.findAll({
                where:
                    { name: 'ຂ່າວສານ' },
                include: [{ model: PostTypesTran },
                {
                    model: Post, separate: true,
                    order: [['id', 'DESC']],
                    include: [{ model: PostTran }, { model: PostImage }, { model: PostImageTran }, { model: NewsCategory, as: 'newsCategories', include: [{ model: NewsCategoryTran }] }]
                }]
            });

            return res.json({
                success: true,
                message: 'Get all data post news english language successfully',
                data: news_EN
            });

        } else {
            // la
            const news_LA = await PostTypes.findAll({
                where:
                    { name: 'ຂ່າວສານ' },
                include: [
                    {
                        model: Post, separate: true,
                        order: [['id', 'DESC']],
                        include: [{ model: PostImage }, { model: NewsCategory, as: 'newsCategories' }]
                    }]
            });

            return res.json({
                success: true,
                message: 'Get all data post news lao language successfully',
                data: news_LA
            });
        }

    } catch (error) {
        next(error);
    }
}

export const findAllEvent = async (req, res, next) => {
    const lang = req.query.lang || req.headers.content_language;
    try {
        const language = await Languages.findOne({ where: { short: lang } });
        if (!language) {
            throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
        }

        if (language.short === _languages.ENGLISH) {
            // eng
            const activitie_EN = await PostTypes.findAll({
                where:
                    { name: 'ກິດຈະກຳ' },
                include: [{ model: PostTypesTran },
                {
                    model: Post, separate: true,
                    order: [['id', 'DESC']], include: [{ model: PostTran, separate: true, }, { model: PostImage, separate: true, }, { model: PostImageTran, separate: true, }]
                }]
            });

            return res.json({
                success: true,
                message: 'Get all activities english language successfully',
                data: activitie_EN
            });

        } else {
            // la
            const activitie_LA = await PostTypes.findAll({
                where:
                    { name: 'ກິດຈະກຳ' },
                include: [
                    {
                        model: Post, separate: true,
                        order: [['id', 'DESC']], include: [{ model: PostImage, separate: true }]
                    }]
            });

            return res.json({
                success: true,
                message: 'Get all activities english language successfully',
                data: activitie_LA
            });

        }

    } catch (error) {
        next(error);
    }
}

export const findAllPostNews_cli = async (req, res, next) => {
    const lang = req.query.lang || req.headers.content_language;
    try {
        const language = await Languages.findOne({ where: { short: lang } });
        if (!language) {
            throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
        }

        if (language.short === _languages.ENGLISH) {
            // eng
            const news_EN = await PostTypes.findAll({
                where:
                    { name: 'ຂ່າວສານ', is_active: true },
                include: [{ model: PostTypesTran },
                {
                    model: Post, where: {
                        status: 'open'
                    }, separate: true,
                    order: [['id', 'DESC']],
                    include: [{ model: PostTran }, { model: PostImage }, { model: PostImageTran }, { model: NewsCategory, as: 'newsCategories', include: [{ model: NewsCategoryTran }] }]
                }]
            });

            // console.log("KKKKKK",news_EN);

            return res.json({
                success: true,
                message: 'Get all data post news english language successfully',
                data: news_EN
            });

        } else {
            // la
            const news_LA = await PostTypes.findAll({
                where:
                    { name: 'ຂ່າວສານ', is_active: true },
                include: [
                    {
                        model: Post, where: {
                            status: 'open',
                        }, separate: true,
                        order: [['id', 'DESC']],
                        include: [{ model: PostImage }, { model: NewsCategory, as: 'newsCategories' }]
                    }]
            });

            return res.json({
                success: true,
                message: 'Get all data post news lao language successfully',
                data: news_LA
            });
        }

    } catch (error) {
        next(error);
    }
}

export const findAllPostPromotions_cli = async (req, res, next) => {
    const lang = req.query.lang || req.headers.content_language;
    try {
        const language = await Languages.findOne({ where: { short: lang } });
        if (!language) {
            throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
        }

        if (language.short === _languages.ENGLISH) {
            // eng
            const promotions_EN = await PostTypes.findAll({
                where:
                    { name: 'ໂປຣໂມຊັນ', is_active: true },
                include: [{ model: PostTypesTran },
                {
                    model: Post, where: {
                        status: 'open', startDate: { [Op.lt]: Date.now() }, endDate: { [Op.gt]: Date.now() }
                    }, required: true, separate: true,
                    order: [['id', 'desc']], include: [{ model: PostTran, separate: true, }, { model: PostImage, separate: true, }, { model: PostImageTran, separate: true, }]
                }]
            });

            return res.json({
                success: true,
                message: 'Get all data promotion english language successfully',
                data: promotions_EN,
            });

        } else {
            // la
            const promotions_LA = await PostTypes.findAll({
                where:
                    { name: 'ໂປຣໂມຊັນ', is_active: true },
                include: [
                    {
                        model: Post, where: {
                            status: 'open', startDate: { [Op.lt]: Date.now() }, endDate: { [Op.gt]: Date.now() }
                        }, separate: true,
                        order: [['id', 'DESC']], include: [{ model: PostImage, separate: true, }]
                    }]
            });

            return res.json({
                success: true,
                message: 'Get all data promotion lao language successfully',
                data: promotions_LA,
            });
        }

    } catch (error) {
        next(error);
    }
}

export const findAllEvent_cli = async (req, res, next) => {
    const lang = req.query.lang || req.headers.content_language;
    try {
        const language = await Languages.findOne({ where: { short: lang } });
        if (!language) {
            throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
        }

        if (language.short === _languages.ENGLISH) {
            // eng
            const activitie_EN = await PostTypes.findAll({
                where:
                    { name: 'ກິດຈະກຳ', is_active: true },
                include: [{ model: PostTypesTran },
                {
                    model: Post, where: {
                        status: 'open', startDate: { [Op.lt]: Date.now() }, endDate: { [Op.gt]: Date.now() }
                    }, separate: true,
                    order: [['id', 'DESC']], include: [{ model: PostTran, separate: true, }, { model: PostImage, separate: true, }, { model: PostImageTran, separate: true, }]
                }]
            });

            return res.json({
                success: true,
                message: 'Get all activities english language successfully',
                data: activitie_EN
            });

        } else {
            // la
            const activitie_LA = await PostTypes.findAll({
                where:
                    { name: 'ກິດຈະກຳ', is_active: true },
                include: [
                    {
                        model: Post, where: {
                            status: 'open', startDate: { [Op.lt]: Date.now() }, endDate: { [Op.gt]: Date.now() }
                        }, separate: true,
                        order: [['id', 'DESC']], include: [{ model: PostImage, separate: true }]
                    }]
            });

            return res.json({
                success: true,
                message: 'Get all activities english language successfully',
                data: activitie_LA
            });

        }

    } catch (error) {
        next(error);
    }
}

/**
 * To create a new post 
 * @param {require data from request body} req 
 * @param {*send data success response} res 
 * @param {*if error is true} next 
 * @type mothod POST
 * @access private
 * @returns 
 */
export const findPostBySlug = async (req, res, next) => {
    const { id, slug } = req.params;
    const lang = req.query.lang || req.headers.content_language;
    try {
        const language = await Languages.findOne({ where: { short: lang } });
        if (!language) {
            throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
        }
        if (language.short === _languages.ENGLISH) {
            let post = await Post.findOne({
                where: { slug: id },
                include:
                    [{ model: PostTran, as: 'PostTrans' },
                    { model: PostImage, as: 'PostImages' },
                    { model: PostImageTran, as: 'PostImageTrans' }]
            });

            if (!post) {
                post = await Post.findOne({

                    include:
                        [{ model: PostTran, where: { slug: id }, required: true, as: 'PostTrans' },
                        { model: PostImage, as: 'PostImages' },
                        { model: PostImageTran, as: 'PostImageTrans' }]
                });

                if (!post) throw createError.NotFound(`Post does not exist. with ID:${slug}`);

            }
            return res.json({
                success: true,
                message: "Get one post for english successfully",
                data: post
            });
        }

        const post = await Post.findOne({
            where: { slug: id },
            include:
                [{ model: PostImage, as: 'PostImages' }]
        });
        if (!post) {
            throw createError.NotFound(`Post does not exist. with ID:${slug}`);
        }

        return res.json({
            success: true,
            message: "Get one post for lao successfully",
            data: post
        });
    } catch (error) {
        next(error);
    }
}

/**
 * To get all post by postType, status open and between dates
 * @param {* require id postType and language from request} req 
 * @param {* send data success response} res 
 * @param {* if error is true} next 
 */
export const findPostByTypeAndStatus = async (req, res, next) => {
    const { id } = req.params;
    const lang = req.query.lang || req.headers.content_language;
    try {
        const postType = await PostTypes.findByPk(id);
        if (!postType) {
            throw createError.NotFound(`Post type not found. with ID:${id}`);
        }
        // Check language
        const language = await Languages.findOne({ where: { short: lang } });
        if (!language) {
            throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
        }
        // const post = await Post.findAll({ where: { postTypeId: id } })

        if (postType.name === 'ໂປຣໂມຊັນ' || postType.name === 'Promotion' || postType.name === 'promotion' || postType.name === 'Promotions' || postType.name === 'promotions') {     // find promotion
            if (language.short === _languages.ENGLISH) {    // eng
                const post_instance = await Post.findAll({
                    where: {
                        postTypeId: postType.id, status: 'open', startDate: { [Op.lt]: Date.now() }, endDate: { [Op.gt]: Date.now() }
                    }, include:
                        [{ model: PostTran, as: 'PostTrans' },
                        { model: PostImage, as: 'PostImages' },
                        { model: PostImageTran, as: 'PostImageTrans' }]
                });

                if (!post_instance[0]) {
                    throw createError.NotFound(`Now promotion empty. with ID:${id}`);
                }
                return res.json({
                    success: true,
                    message: `List of all promotions`,
                    data: post_instance
                });
            }
            // la
            const post_instance = await Post.findAll({
                where: {
                    postTypeId: postType.id, status: 'open', startDate: { [Op.lt]: Date.now() }, endDate: { [Op.gt]: Date.now() }
                }, include:
                    [{ model: PostImage, as: 'PostImages' }]
            });

            if (!post_instance[0]) {
                throw createError.NotFound(`Now promotion empty. with ID:${id}`);
            }
            return res.json({
                success: true,
                message: `ລາຍການໂປຣໂມຊັນທັງໝົດ`,
                data: post_instance
            });

        } else if (postType.name === 'event' || postType.name === 'Event') {    // find event
            if (language.short === _languages.ENGLISH) {
                const post_instance = await Post.findAll({
                    where: {
                        postTypeId: postType.id, status: 'open', startDate: { [Op.lt]: Date.now() }, endDate: { [Op.gt]: Date.now() }
                    }, include:
                        [{ model: PostTran, as: 'PostTrans' },
                        { model: PostImage, as: 'PostImages' },
                        { model: PostImageTran, as: 'PostImageTrans' }]
                });
                // console.log();
                if (!post_instance[0]) {
                    throw createError.NotFound(`Now promotion empty. with ID:${id}`);
                }
                return res.json({
                    success: true,
                    message: `List of all events`,
                    data: post_instance
                });
            }
            // la
            const post_instance = await Post.findAll({
                where: {
                    postTypeId: postType.id, status: 'open', startDate: { [Op.lt]: Date.now() }, endDate: { [Op.gt]: Date.now() }
                }, include:
                    [{ model: PostImage, as: 'PostImages' }]
            });

            if (!post_instance[0]) {
                throw createError.NotFound(`Now promotion empty. with ID:${id}`);
            }
            return res.json({
                success: true,
                message: `ລາຍການ Event ທັງໝົດ`,
                data: post_instance
            });
        }
        // post normal
        if (language.short === _languages.ENGLISH) {    // eng
            const post_instance = await Post.findAll({
                where: { postTypeId: id, status: 'open' }, include:
                    [{ model: PostTran, as: 'PostTrans' },
                    { model: PostImage, as: 'PostImages' },
                    { model: PostImageTran, as: 'PostImageTrans' }]
            });

            if (!post_instance[0]) {
                throw createError.NotFound(`This post empty. with ID:${id}`);
            }
            return res.json({
                success: true,
                message: `Get all post successfully`,
                data: post_instance,
            });
        }
        // la
        const post_instance = await Post.findAll({
            where: { postTypeId: id, status: 'open' }, include:
                [{ model: PostImage, as: 'PostImages' }]
        });

        if (!post_instance[0]) {
            throw createError.NotFound(`This post empty. with ID:${id}`);
        }
        return res.json({
            success: true,
            message: `ລາຍການ post ທັງໝົດ`,
            data: post_instance,
        });

    } catch (error) {
        next(error);
    }
}

/**
 * cliet --> To get lasted post new limit 4
 * @param {* require language from request} req 
 * @param {* send data success response} res 
 * @param {* if error is true} next 
 * @type mothod GET 
 * @access public
 */
export const findPostNew_Limit = async (req, res, next) => {
    const lang = req.query.lang || req.headers.content_language;
    try {
        const language = await Languages.findOne({ where: { short: lang } });
        if (language.short === _languages.ENGLISH) {
            // eng
            const news_EN = await PostTypes.findAll({
                where:
                    { name: 'ຂ່າວສານ', is_active: true },
                include: [{ model: PostTypesTran },
                {
                    model: Post, where: { status: 'open' }, separate: true, limit: 4,
                    order: [['id', 'desc']], include: [{ model: PostTran, separate: true, }, { model: PostImage, separate: true, }, { model: PostImageTran, separate: true, }]
                }]
            });
            return res.json({
                success: true,
                message: `Get all lasted post new limit 4 english language successfully`,
                data: news_EN,
            });
        }
        // la
        const news_LA = await PostTypes.findAll({
            where:
                { name: 'ຂ່າວສານ', is_active: true },
            include: [{
                model: Post, where: { status: 'open' }, separate: true, limit: 4,
                order: [['id', 'desc']], include: [{ model: PostImage, separate: true, }]
            }]
        });
        return res.json({
            success: true,
            message: `Get all lasted post new limit 4 lao language successfully`,
            data: news_LA
        });
    } catch (error) {
        next(error);
    }
}

/**
 * admin --> To delete a post
 * @param {require data from request body} req 
 * @param {*send data success response} res 
 * @param {*if error is true} next 
 * @type mothod POST
 * @access private
 * @returns 
 */
export const deletePost = async (req, res, next) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();
    try {
        const jobRecuit = await JobRecuit.findAll({ where: { postId: id } }, { transaction: transaction });
        if (jobRecuit.length > 0) {
            throw createError.BadRequest(`Unable to delete ID:${id} at this time. Because the jobRecuit table is active`);
        }

        const post = await Post.findByPk(id, { transaction: transaction });
        if (!post) {
            throw createError.NotFound(`Post does not exist. with ID:${id}`);
        }

        await PostImageTran.destroy({ where: { postId: id } }, { transaction: transaction });
        await PostImage.destroy({ where: { postId: id } }, { transaction: transaction });
        await PostTran.destroy({ where: { postId: id } }, { transaction: transaction });
        await post.destroy();

        await transaction.commit();
        return res.json({
            success: true,
            message: "Delete post successfully"
        });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}



// -------------> report promotion < --------------
export const reportPromotion = async (req, res, next) => {
    const value = req.query.status || req.headers.status;
    try {

        if (!value) {
            // No conditions
            const promotions_EN = await PostTypes.findAll({
                where:
                    { name: 'ໂປຣໂມຊັນ' },
                include: [{ model: PostTypesTran },
                {
                    model: Post, separate: true,
                    order: [['id', 'desc']], include: [{ model: PostTran, separate: true, }, { model: PostImage, separate: true, }, { model: PostImageTran, separate: true, }]
                }]
            });

            return res.json({
                success: true,
                message: 'Get all data report promotion success',
                data: promotions_EN,
            });
        } else {
            // have conditions value
            const promotions_EN = await PostTypes.findAll({
                where:
                    { name: 'ໂປຣໂມຊັນ', is_active: true },
                include: [{ model: PostTypesTran },
                {
                    model: Post, where: {
                        status: value,
                    }, required: true, separate: true,
                    order: [['id', 'desc']], include: [{ model: PostTran, separate: true, }, { model: PostImage, separate: true, }, { model: PostImageTran, separate: true, }]
                }]
            });

            return res.json({
                success: true,
                message: `Get all data report promotion conditions: ${value} success`,
                data: promotions_EN,
            });
        }

    } catch (error) {
        next(error);
    }
}

// --------------> report promotion between date <---------------
export const reportPromotionBetweenDate = async (req, res, next) => {
    const { startOfDate, endOfDate } = req.query;
    try {

        const promotions_EN = await PostTypes.findAll({
            where:
                { name: 'ໂປຣໂມຊັນ' },
            include: [{ model: PostTypesTran },
            {
                model: Post, where: {
                    startDate: {
                        [Op.between]: [startOfDate, endOfDate],
                    },
                }, separate: true,
                order: [['id', 'desc']], include: [{ model: PostTran, separate: true, }, { model: PostImage, separate: true, }, { model: PostImageTran, separate: true, }]
            }]
        });

        return res.json({
            success: true,
            message: `Report promotion between ${startOfDate} and ${endOfDate} success`,
            data: promotions_EN,
        });

    } catch (error) {
        next(error);
    }
}

// -------------> report promotion < --------------
export const reportActivities = async (req, res, next) => {
    const value = req.query.status || req.headers.status;
    try {

        if (!value) {
            // No conditions
            const activi_EN = await PostTypes.findAll({
                where:
                    { name: 'ກິດຈະກຳ' },
                include: [{ model: PostTypesTran },
                {
                    model: Post, separate: true,
                    order: [['id', 'desc']], include: [{ model: PostTran, separate: true, }, { model: PostImage, separate: true, }, { model: PostImageTran, separate: true, }]
                }]
            });

            return res.json({
                success: true,
                message: 'Get all data report activiites success',
                data: activi_EN,
            });
        } else {
            // have conditions value
            const promotions_EN = await PostTypes.findAll({
                where:
                    { name: 'ກິດຈະກຳ', is_active: true },
                include: [{ model: PostTypesTran },
                {
                    model: Post, where: {
                        status: value,
                    }, required: true, separate: true,
                    order: [['id', 'desc']], include: [{ model: PostTran, separate: true, }, { model: PostImage, separate: true, }, { model: PostImageTran, separate: true, }]
                }]
            });

            return res.json({
                success: true,
                message: `Get all data report activities conditions: ${value} success`,
                data: promotions_EN,
            });
        }

    } catch (error) {
        next(error);
    }
}

// -------------> report activities between date < --------------
export const reportActivitiesBetweenDate = async (req, res, next) => {
    const { startOfDate, endOfDate } = req.query;
    try {

        const activi_EN = await PostTypes.findAll({
            where:
                { name: 'ກິດຈະກຳ' },
            include: [{ model: PostTypesTran },
            {
                model: Post, where: {
                    startDate: {
                        [Op.between]: [startOfDate, endOfDate],
                    },
                }, separate: true,
                order: [['id', 'desc']], include: [{ model: PostTran, separate: true, }, { model: PostImage, separate: true, }, { model: PostImageTran, separate: true, }]
            }]
        });

        return res.json({
            success: true,
            message: `Report activiites between ${startOfDate} and ${endOfDate} success`,
            data: activi_EN,
        });

    } catch (error) {
        next(error);
    }
}

