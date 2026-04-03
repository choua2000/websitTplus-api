import { BannerFindjob, BannerFindjobTran, Languages, sequelize } from '../models';
import { addBannerFindjobSchema } from '../validators/bannerfindjob.validator';

export const getBannerFindjob = async (req, res) => {
    try {
        const bannerFindjob = await BannerFindjob.findAll({
            where: {
                is_active: true,
            },
            include: [
                {
                    model: BannerFindjobTran,
                    as: 'BannerFindjobTrans',
                    include: [
                        {
                            model: Languages,
                            as: 'Languages',
                        },
                    ],
                },
            ],
        });
        res.status(200).json(bannerFindjob);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


//MEAN: createBannerFindjob
export const createBannerFindjob = async (req, res, next) => {

    const { files } = req;
    const transaction = await sequelize.transaction();
    try {
        if (typeof req.body.other_lang === 'string') {
            req.body.other_lang = JSON.parse(req.body.other_lang);
        }
        console.log("Req Body:", req.body);
        // validate body
        const body = await addBannerFindjobSchema.validateAsync(req.body);
        console.log("Validated Body:", body);

        // Check banner (if banName provided)
        if (body.name) {
            const bannerFindjob = await BannerFindjob.findOne({ where: { name: body.name } }, { transaction: transaction });
            if (bannerFindjob) {
                await transaction.rollback();
                return res.status(400).json({ message: `This banner ${body.name} already exists` });
            }
        }

        // check bannerTran (only checking the first one as per original code logic)
        if (body.other_lang && body.other_lang.length > 0 && body.other_lang[0].name) {
            const bannerFindjobTran = await BannerFindjobTran.findOne({ where: { name: body.other_lang[0].name } }, { transaction: transaction });
            if (bannerFindjobTran) {
                await transaction.rollback();
                return res.status(400).json({ message: `This bannerTran ${body.other_lang[0].name} already exists` });
            }
        }

        // check language
        if (body.other_lang && body.other_lang.length > 0) {
            const lang = await Languages.findByPk(body.other_lang[0].languageId, { transaction: transaction });
            if (!lang) {
                await transaction.rollback();
                return res.status(404).json({ message: "Languages not found just the moment. Please choose language supported now." });
            }
        }


        if (!files || !files[0]) {
            // no files upload  
            const imageUrl = `${process.env.DOMAIN || ''}/images/defaultBannerImage.png`;

            const newBannerFindjob = await BannerFindjob.create({
                name: body.name,
                link: body.link,
                image: imageUrl,
                description: body.description,
                is_active: true
            }, { transaction: transaction });

            if (body.other_lang && body.other_lang.length > 0) {
                await BannerFindjobTran.create({
                    bannerFindjobId: newBannerFindjob.id, // Fixed: bannerId -> bannerFindjobId
                    languageId: body.other_lang[0].languageId,
                    name: body.other_lang[0].name ,
                    link: body.other_lang[0].link,
                    image: imageUrl,
                    description: body.other_lang[0].description,
                }, { transaction: transaction });
            }
            await transaction.commit();

            const responseData = await BannerFindjob.findByPk(newBannerFindjob.id, {
                include: [{ model: BannerFindjobTran, as: 'BannerFindjobTrans' }] // Fixed alias: BannerFindjobTrans -> BannerFindjobTran (based on Step 12 association)
            });

            return res.json({
                success: true,
                message: "Created banner successfully",
                data: responseData
            });

        } else {
            // have file upload
            let imageUrl = []
            files.filter(file => file.fieldname == 'avatar[]')
                .forEach((fn) => {
                    imageUrl.push(`${process.env.DOMAIN || ''}/images/ban-images-findjob/${fn.filename}`);
                });

            let imageUrlTran = []
            files.filter(file => file.fieldname == 'avatar_EN[]')
                .forEach((fn) => {
                    imageUrlTran.push(`${process.env.DOMAIN || ''}/images/ban-images-findjob/${fn.filename}`);
                });

            const newBannerFindjob = await BannerFindjob.create({
                name: body.name || body.banName, // Mapping banName to name
                link: body.link,
                image: imageUrl[0],
                description: body.description,
                is_active: true
            }, { transaction: transaction });

            if (body.other_lang && body.other_lang.length > 0) {
                await BannerFindjobTran.create({
                    bannerFindjobId: newBannerFindjob.id, // Fixed: bannerId -> bannerFindjobId
                    languageId: body.other_lang[0].languageId,
                    name: body.other_lang[0].name,
                    link: body.other_lang[0].link,
                    image: imageUrlTran[0] || imageUrl[0], // fallback if no trans image
                    description: body.other_lang[0].description,
                }, { transaction: transaction });
            }
            await transaction.commit();

            const responseData = await BannerFindjob.findByPk(newBannerFindjob.id, {
                include: [{ model: BannerFindjobTran, as: 'BannerFindjobTrans' }] // Fixed alias
            });
            console.log("responseData", responseData);
            return res.json({
                success: true,
                message: "Created banner successfully",
                data: responseData,
            });
        }
    } catch (error) {
        console.log("error==>", error);
        if (transaction) await transaction.rollback();
        if (error.isJoi === true) error.status = 422;
        next(error);
    }
}

// MEAN : filter where 