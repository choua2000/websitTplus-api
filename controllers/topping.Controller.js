import { Priority, sequelize } from '../models';
import createError from 'http-errors';
import priorityValid from '../libs/utils/priority';


/**
 * admin --> To update position topping
 * @param {* require type Priority from request array} req 
 * @param {* send data success response} res 
 * @param {* if error is true} next 
 * @type mothod POST
 * @access private
 * @returns 
 */
export const updateTopping = async (req, res, next) => {
    const { body } = req;
    const transaction = await sequelize.transaction();
    try {
        // new position topping want to update
        const newPositionTop = body.map((item) => item.type);
       
        // default element topping
        let validType = priorityValid.map((item) => item.type);
       
        // Check length
        if (newPositionTop.length != validType.length) throw createError.BadRequest(`Please check your position topping`);

        // Check element in array
        const valid = validType.every((item) => {
            return newPositionTop.includes(item);
        })
        if (!valid) throw createError.BadRequest(`Failed !!. Please check your element`);

        // update position topping
        await Promise.all(body.map(async (item, index) => {
            let inDex = index + 1;
            await Priority.update({
                priority: inDex,
            }, { where: { type: item.type } }, { transaction: transaction });
        }));
        await transaction.commit();

        const responseData = await Priority.findAll({ order: [['priority', 'ASC']] });

        return res.json({
            success: true,
            message: `Updated new position topping successfully.`,
            data: responseData,
        });

    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}

/**
 * admin --> To get a list of priority
 * @param {*} req 
 * @param {* send data success response} res 
 * @param {* if error is true} next 
 * @type mothod GET
 * @access private
 * @returns 
 */
export const findPriority = async (req, res, next) => {
    try {
        const priority = await Priority.findAll({ order: [['priority', 'ASC']] });

        return res.json({
            success: true,
            message: `Get topping success`,
            data: priority
        });
        
    } catch (error) {
        next(error);
    }
}