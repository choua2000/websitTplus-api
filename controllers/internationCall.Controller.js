import {
    Zone,
    InternationalCall,
    Languages,
    sequelize
} from '../models';
import { Op } from 'sequelize';
import createError from 'http-errors';
import _languages from '../constants/language';
import {
    addInternationSchema,
    editInternationSchema,
    addZoneSchema
} from '../validators/internationCall.validator';


// ----------------> CRUD zones <----------------------
export const createZone = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const body = await addZoneSchema.validateAsync(req.body);

        // check duplicate zone
        const uniqueZone = await Zone.findOne({ where: { [Op.or]: [{ zoneName_la: body.zoneName_la }, { zoneName_en: body.zoneName_en }] } });
        if (uniqueZone) throw createError.BadRequest(`This zone ${body.zoneName_la} and ${body.zoneName_en} is already taken`);

        const newZone = await Zone.create({
            zoneName_la: body.zoneName_la,
            zoneName_en: body.zoneName_en,
            description: body.description ? body.description : null,
        }, { transaction: transaction });
        await transaction.commit();

        return res.json({
            success: true,
            message: `Created new zone successfully`,
            data: newZone
        });

    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        await transaction.rollback();
        next(error);
    }
}

export const updateZone = async (req, res, next) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();
    try {
        const body = await addZoneSchema.validateAsync(req.body);

        // check duplicate zone name
        const uniqueZone_la = await Zone.findAll({ where: { zoneName_la: body.zoneName_la, id: { [Op.ne]: id } } });
        if (uniqueZone_la[0]) throw createError.BadRequest(`This zone name lao ${body.zoneName_la} already taken`);

        const uniqueZone_en = await Zone.findAll({ where: { zoneName_en: body.zoneName_en, id: { [Op.ne]: id } } });
        if (uniqueZone_en[0]) throw createError.BadRequest(`This zone name english ${body.zoneName_en} already taken`);

        // create
        const zone = await Zone.findByPk(id, { transaction: transaction });
        if (!zone) throw createError.NotFound(`This zone not found. with ID:${id}`);
        zone.zoneName_la = body.zoneName_la;
        zone.zoneName_en = body.zoneName_en;
        zone.description = body.description ? body.description : zone.description;
        await zone.save();
        await transaction.commit();

        return res.json({
            success: true,
            message: `Updated zone ID:${id} successfully`,
            data: zone,
        });
        
    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        await transaction.rollback();
        next(error);
    }
}


export const findZone = async (req, res, next) => {
    const lang = req.query.lang || req.headers.content_language;
    try {
        const language = await Languages.findOne({ where: { short: lang } });
        if (!language) throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");

        if (language.short === _languages.ENGLISH) {
            // eng
            const zones = await Zone.findAll({ order: [['id', 'DESC']] });
            return res.json({
                success: true,
                message: `get all zones successfully`,
                data: zones
            });
        }
        // la
        const zones = await Zone.findAll({ attributes: ['id', 'zoneName_la', 'description', 'createdAt', 'updatedAt'], order: [['id', 'DESC']] });
        return res.json({
            success: true,
            message: `get all zones successfully`,
            data: zones
        });

    } catch (error) {
        next(error);
    }
}

export const findOneZone = async (req, res, next) => {
    const { id } = req.params;
    const lang = req.query.lang || req.headers.content_language;
    try {
        const language = await Languages.findOne({ where: { short: lang } });
        if (!language) throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");

        if (language.short === _languages.ENGLISH) {
            // eng
            const zones = await Zone.findByPk(id);
            if (!zones) throw createError.NotFound(`This zones does not exist. with ID:${id}`)
            return res.json({
                success: true,
                message: `get a zones successfully`,
                data: zones
            });
        }
        // la
        const zones = await Zone.findByPk(id, { attributes: ['id', 'zoneName_la', 'description', 'createdAt', 'updatedAt'] });
        if (!zones) throw createError.NotFound(`This zones does not exist. with ID:${id}`)
        return res.json({
            success: true,
            message: `get a zones successfully`,
            data: zones
        });

    } catch (error) {
        next(error);
    }
}

export const deleteZone = async (req, res, next) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();
    try {
        const interCalls = await InternationalCall.findAll({ where: { zoneId: id } });
        if (interCalls.length > 0) throw createError.BadRequest(`Unable to delete ID:${id} at this time. Because the international_call table is active`);

        const zone = await Zone.findByPk(id, { transaction: transaction });
        if (!zone) throw createError.NotFound(`This zone does not exist. with ID:${id}`);
        await zone.destroy();
        await transaction.commit();
        return res.json({
            success: true,
            message: `Deleted zone ID: ${id} successfully`,
        });

    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        await transaction.rollback();
        next(error);
    }
}

// -------------------> CRUD International Call <--------------------------

export const create_InternationalCall = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const body = await addInternationSchema.validateAsync(req.body);

        // check zone
        const zone = await Zone.findByPk(body.zoneId);
        if (!zone) throw createError.BadRequest(`This zone does not exist. with zoneID:${body.zoneId} please choose zone support now`);

        // check duplicate internationCall in zone
        const uniqueInterCallOnZone_la = await InternationalCall.findAll({ where: { countryName_la: body.countryName_la, zoneId: body.zoneId } });
        if (uniqueInterCallOnZone_la[0]) throw createError.BadRequest(`This country name lao ${body.countryName_la} in zone ID:${body.zoneId} is already taken`);

        const uniqueInterCallOnZone_en = await InternationalCall.findAll({ where: { countryName_en: body.countryName_en, zoneId: body.zoneId } });
        if (uniqueInterCallOnZone_en[0]) throw createError.BadRequest(`This country name english ${body.countryName_en} in zone ID:${body.zoneId} is already taken`);

        const newInterCall = await InternationalCall.create({
            countryName_la: body.countryName_la,
            countryName_en: body.countryName_en,
            code: body.code,
            zoneId: body.zoneId,
            price_minute: body.price_minute,
        }, { transaction: transaction });
        await transaction.commit();

        return res.json({
            success: true,
            message: `Created new internationCall success`,
            data: newInterCall,
        });

    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        await transaction.rollback();
        next(error);
    }
}

export const update_InternationalCall = async (req, res, next) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();
    try {
        const body = await editInternationSchema.validateAsync(req.body);
        // check zone
        const zone = await Zone.findByPk(body.zoneId);
        if (!zone) throw createError.BadRequest(`This zone does not exist. with zoneID:${body.zoneId} please choose zone support now`);

        // check duplicate internationCall in zone
        const uniqueInterCallOnZone_la = await InternationalCall.findAll({ where: { countryName_la: body.countryName_la, zoneId: body.zoneId, id: { [Op.ne]: id } } });
        if (uniqueInterCallOnZone_la[0]) throw createError.BadRequest(`This country name lao ${body.countryName_la} in zone ID:${body.zoneId} is already taken`);

        const uniqueInterCallOnZone_en = await InternationalCall.findAll({ where: { countryName_en: body.countryName_en, zoneId: body.zoneId, id: { [Op.ne]: id } } });
        if (uniqueInterCallOnZone_en[0]) throw createError.BadRequest(`This country name english ${body.countryName_en} in zone ID:${body.zoneId} is already taken`);

        // update
        const interCall = await InternationalCall.findByPk(id, { transaction: transaction });
        if (!interCall) throw createError.NotFound(`This country does not exist. with ID:${id}`);

        interCall.countryName_la = body.countryName_la;
        interCall.countryName_en = body.countryName_en;
        interCall.code = body.code;
        interCall.zoneId = body.zoneId;
        interCall.price_minute = body.price_minute;
        await interCall.save();
        await transaction.commit();
        return res.json({
            success: true,
            message: `Updated internationCall ID:${id} successfully`,
            data: interCall
        });

    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        await transaction.rollback();
        next(error);
    }
}

export const find_InternationalCall = async (req, res, next) => {
    const lang = req.query.lang || req.headers.content_language;
    try {
        const language = await Languages.findOne({ where: { short: lang } });
        if (!language) throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
        if (language.short === _languages.ENGLISH) {
            // eng
            const interCalls = await InternationalCall.findAll({ include: [{ model: Zone, as: 'Zones', attributes: ['id', 'zoneName_en', 'description'] }], order: [['id', 'DESC']] });

            return res.json({
                success: true,
                message: `get all internationCall success`,
                data: interCalls
            });
        }
        // la
        const interCalls = await InternationalCall.findAll({
            attributes: ['id', 'countryName_la', 'code', 'zoneId', 'price_minute', 'createdAt', 'updatedAt'],
            include: [{ model: Zone, as: 'Zones', attributes: ['id', 'zoneName_la', 'description',] }], order: [['id', 'DESC']]
        });

        return res.json({
            success: true,
            message: `get all internationCall success`,
            data: interCalls
        });

    } catch (error) {
        next(error);
    }
}

export const findOne_InternationalCall = async (req, res, next) => {
    const { id } = req.params;
    const lang = req.query.lang || req.headers.content_language;
    try {
        const language = await Languages.findOne({ where: { short: lang } });
        if (!language) throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");

        if (language.short === _languages.ENGLISH) {
            // eng
            const interCall = await InternationalCall.findByPk(id,
                { include: [{ model: Zone, as: 'Zones', attributes: ['id', 'zoneName_en', 'description'] }] });
            if (!interCall) throw createError.NotFound(`This internation call does not exist. with ID:${id}`);

            return res.json({
                success: true,
                message: `get a internationCall success`,
                data: interCall
            });
        }
        // la
        const interCall = await InternationalCall.findByPk(id,
            { attributes: ['id', 'countryName_la', 'code', 'zoneId', 'price_minute', 'createdAt', 'updatedAt'], include: [{ model: Zone, as: 'Zones', attributes: ['id', 'zoneName_la', 'description'] }] });
        if (!interCall) throw createError.NotFound(`This internation call does not exist. with ID:${id}`);

        return res.json({
            success: true,
            message: `get a internationCall success`,
            data: interCall
        });

    } catch (error) {
        next(error);
    }
}

export const delete_InternationalCall = async (req, res, next) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();
    try {
        const interCall = await InternationalCall.findByPk(id, { transaction: transaction });
        if (!interCall) throw createError.NotFound(`This interCall does not exist. with ID:${id}`);
        await interCall.destroy();
        await transaction.commit();
        return res.json({
            success: true,
            message: `Deleted international call ID:${id} successfully`,
        });

    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}