import {
    Priority,
    Banner,
    BannerTran,
    Product,
    ProductTran,
    ProductImage,
    PostTypes,
    PostTypesTran,
    Post,
    PostTran,
    PostImage,
    PostImageTran,
    Languages,
    TypePackage,
    TypePackagTran,
    NewPackage,
    NewPackageTran,
    SimType,
    NewsCategory,
    NewsCategoryTran,
    NewsCategoryPost,
    sequelize
} from '../models';
import { Op } from 'sequelize';
import createError from 'http-errors';
import _languages from '../constants/language';
import priorytivalid from '../libs/utils/priority'


/**
 * client --> To get banner, packages, promotions, activities and news
 * @param {* require language from request} req 
 * @param {* send data success response} res 
 * @param {* if error is true} next 
 * @type mothod GET
 * @access public
 * @returns 
 */
export const homePage = async (req, res, next) => {
    const lang = req.query.lang || req.headers.content_language;
    try {

        // ---------> promotions <---------
        const promotions_EN = await PostTypes.findAll({
            where:
                { name: 'ໂປຣໂມຊັນ', is_active: true },
            include: [{ model: PostTypesTran },
            {
                model: Post, where: {
                    status: 'open', startDate: { [Op.lt]: Date.now() }, endDate: { [Op.gt]: Date.now() }
                }, separate: true, limit: 4,
                order: [['id', 'desc']], include: [{ model: PostTran, separate: true, }, { model: PostImage, separate: true, }, { model: PostImageTran, separate: true, }]
            }]
        });

        const promotions_LA = await PostTypes.findAll({
            where: { name: 'ໂປຣໂມຊັນ', is_active: true },
            include: [{
                model: Post, where: {
                    status: 'open', startDate: { [Op.lt]: Date.now() }, endDate: { [Op.gt]: Date.now() }
                }, separate: true, limit: 4,
                order: [['id', 'desc']], include: [{ model: PostImage, separate: true, }]
            }]
        });

        // ---------> activities <---------
        const activitie_EN = await PostTypes.findAll({
            where:
                { name: 'ກິດຈະກຳ', is_active: true },
            include: [{ model: PostTypesTran },
            {
                model: Post, where: {
                    status: 'open', startDate: { [Op.lt]: Date.now() }, endDate: { [Op.gt]: Date.now() }
                }, separate: true, limit: 4,
                order: [['id', 'desc']], include: [{ model: PostTran, separate: true, }, { model: PostImage, separate: true, }, { model: PostImageTran, separate: true, }]
            }]
        });

        const activitie_LA = await PostTypes.findAll({
            where:
                { name: 'ກິດຈະກຳ', is_active: true },
            include: [{
                model: Post, where: {
                    status: 'open', startDate: { [Op.lt]: Date.now() }, endDate: { [Op.gt]: Date.now() }
                }, separate: true, limit: 4,
                order: [['id', 'desc']], include: [{ model: PostImage, separate: true, }]
            }]
        });

        // ---------> news <---------
        // const news_EN = await PostTypes.findAll({
        //     where:
        //         { name: 'ຂ່າວສານ', is_active: true },
        //     include: [{ model: PostTypesTran },
        //     {
        //         model: Post, separate: true, limit: 4,
        //         order: [['id', 'desc']], include: [{ model: PostTran, separate: true, }, { model: PostImage, separate: true, }, { model: PostImageTran, separate: true, }]
        //     }]
        // });

        // const news_LA = await PostTypes.findAll({
        //     where:
        //         { name: 'ຂ່າວສານ', is_active: true },
        //     include: [{
        //         model: Post, separate: true, limit: 4,
        //         order: [['id', 'desc']], include: [{ model: PostImage, separate: true, }]
        //     }]
        // });

        // ---------> packages <---------
        // const packages_EN = await NewPackage.findAll({ limit: 4, order: [['id', 'DESC']] });

        // const packages_LA = await NewPackage.findAll({
        //     attributes: ['id', 'code', 'la_name', 'image', 'createdAt', 'updatedAt'], limit: 4, order: [['id', 'DESC']]
        // });


        // ---------> package english <---------------
        const typePackage_Prepaid = await TypePackage.findByPk(1,
            {
                include: [{ model: TypePackagTran },
                { model: NewPackage, limit: 4, include: [{ model: NewPackageTran }], order: [['priority', 'ASC']] }]
            });
        const typePackage_Postpaid = await TypePackage.findByPk(2,
            {
                include: [{ model: TypePackagTran },
                { model: NewPackage, limit: 4, include: [{ model: NewPackageTran }], order: [['priority', 'ASC']] }]
            });
        // const typePackage_Netsim = await TypePackage.findByPk(3,
        //     {
        //         include: [{ model: TypePackagTran },
        //         { model: NewPackage, limit: 4, include: [{ model: NewPackageTran }], order: [['priority', 'ASC']] }]
        //     });

        // ---------> package default language <---------

        const typePackage_Prepaid_LA = await TypePackage.findByPk(1,
            {
                include: [
                    // { model: TypePackagTran },
                    { model: NewPackage, limit: 4, order: [['priority', 'ASC']] }]
            });
        const typePackage_Postpaid_LA = await TypePackage.findByPk(2,
            {
                include: [
                    // { model: TypePackagTran },
                    { model: NewPackage, limit: 4, order: [['priority', 'ASC']] }]
            });
        // const typePackage_Netsim_LA = await TypePackage.findByPk(3,
        //     {
        //         include: [
        //             // { model: TypePackagTran },
        //             { model: NewPackage, limit: 4, order: [['priority', 'ASC']] }]
        //     });

        //check lang defined or not 
        if (lang === undefined) {
            throw createError.BadRequest(`Please! defined language`)
        }

        // check if language
        const language = await Languages.findOne({ where: { short: lang } });
        if (!language) {
            throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
        }

        // check and set priority
        const priorityData = await Priority.findAll();

        let arrPriorities = {};

        priorityData.forEach(item => {
            arrPriorities[item.type] = item.priority
        })

        // check languages from client resquest
        if (language.short === _languages.ENGLISH) {
            // eng
            let responseData = [
                {
                    message: "Packages",
                    // packages: packages_EN,
                    packages: [
                        { prepaid: typePackage_Prepaid },
                        { postpaid: typePackage_Postpaid },
                        // { netsim: typePackage_Netsim }
                    ],
                    priority: arrPriorities.Package
                },
                {
                    message: "Activities",
                    activities: activitie_EN,
                    priority: arrPriorities.Activities
                },
                {
                    message: "Promotions",
                    promotions: promotions_EN,
                    priority: arrPriorities.Promotion
                },
                // {
                //     message: "News",
                //     news: news_EN,
                //     priority: arrPriorities.News
                // },
            ];

            return res.json({
                success: true,
                data: responseData,
            })


        } else {
            // la
            let responseData = [
                {
                    message: "ແພັກເກັດ",
                    // packages: packages_LA,
                    packages: [
                        { prepaid: typePackage_Prepaid_LA },
                        { postpaid: typePackage_Postpaid_LA },
                        // { netsim: typePackage_Netsim_LA }
                    ],
                    priority: arrPriorities.Package
                },
                {
                    message: "ກິດຈະກຳ",
                    activities: activitie_LA,
                    priority: arrPriorities.Activities
                },
                {
                    message: "ໂປຣໂມຊັນ",
                    promotions: promotions_LA,
                    priority: arrPriorities.Promotion
                },
                // {
                //     message: "ຂ່າວສານ",
                //     news: news_LA,
                //     priority: arrPriorities.News
                // },
            ];

            return res.json({
                success: true,
                data: responseData,
            })

        }

    } catch (error) {
        next(error);
    }
}

/**
 * client --> To search package or activities or news
 * @param {* require key word from query} req 
 * @param {* send data success response} res 
 * @param {* if error is true} next 
 * @type mothod GET
 * @access public
 * @returns 
 */
export const search = async (req, res, next) => {
    const search = req.query.filter;
    try {

        // ---------> packages <---------
        const packages_EN = await NewPackage.findAll({ where: { [Op.or]: { code: { [Op.like]: `%${search}%` }, en_name: { [Op.like]: `%${search}%` }, la_name: { [Op.like]: `%${search}%` } } } });


        // ---------> activities <---------
        const activitie_EN = await PostTypes.findAll({
            where: {
                name: 'ກິດຈະກຳ', is_active: true,
                [Op.or]: [
                    { "$Posts.title$": { [Op.like]: `%${search}%` }, },
                    { "$Posts->PostTrans.title$": { [Op.like]: `%${search}%` } }
                ]
            },
            include: [{ model: PostTypesTran }, {
                model: Post, required: false,
                include: [{ model: PostTran, as: 'PostTrans', required: false, },
                { model: PostImage, required: false, }, { model: PostImageTran, required: false, }],

            }]
        });


        // ---------> news <---------
        const news_EN = await PostTypes.findAll({
            where: {
                name: 'ຂ່າວສານ', is_active: true,
                [Op.or]: [
                    { "$Posts.title$": { [Op.like]: `%${search}%` }, },
                    { "$Posts->PostTrans.title$": { [Op.like]: `%${search}%` } }
                ]
            },
            include: [{ model: PostTypesTran }, {
                model: Post, required: false,
                include: [{ model: PostTran, as: 'PostTrans', required: false, },
                { model: PostImage, required: false, }, { model: PostImageTran, required: false, }],

            }]
        });


        let responseData = [

            {
                message: "Packages",
                packages: packages_EN,
            },
            {
                message: "Activities",
                activities: activitie_EN,
            },
            {
                message: "News",
                news: news_EN,
            },
        ];

        return res.json({
            success: true,
            message: `successfully`,
            data: responseData,
        });

    } catch (error) {
        next(error);
    }
}