import {
    Post,
    Position,
    JobRecuit,
    JobSeeker,
    JobSeekerFile,
    sequelize
} from '../models';
import createError from 'http-errors';
import { validateEmail } from '../libs/utils/regex';
import { DOMAIN } from '../constants/index';
import { addJobRecuitSchema } from '../validators/jobRecuit.validator';

/**
 * To send job recuit 
 * @param {*require data from request body} req 
 * @param {*send data success response} res 
 * @param {*if send data error} next 
 * @type mothod POST
 * @access public
 * @returns 
 */
export const createJobRecuit = async (req, res, next) => {
    const { files } = req;
    const transaction = await sequelize.transaction();
    try {
        const body = await addJobRecuitSchema.validateAsync(req.body);
        const email = validateEmail(body.email);

        if (!email) {
            throw createError.BadRequest("Please enter an email address");
        }
        const post = await Post.findByPk(body.postId, { transaction: transaction });
        if (!post) {
            throw createError.NotFound(`Post does not exist. with ID:${body.postId}`);
        }
        const position = await Position.findByPk(body.positionId, { transaction: transaction });
        if (!position) {
            throw createError.NotFound(`position does not exist. with ID:${body.positionId}`);
        }

        if (!files[0]) {
            throw createError.BadRequest("Please upload a file");
        } else {
            const fileUrl = `${DOMAIN}/resources/uploads/${files[0].filename}`;

            const newJobRecuit = await JobRecuit.create({
                postId: body.postId,
                positionId: body.positionId,
            }, { transaction: transaction });

            const newJobSeeker = await JobSeeker.create({
                jobRecuitId: newJobRecuit.id,
                name: body.name,
                surName: body.surName,
                email: body.email,
                phone: body.phone,
            }, { transaction: transaction });

            await JobSeekerFile.create({
                jobSeekerId: newJobSeeker.id,
                file: fileUrl
            }, { transaction: transaction });
            await transaction.commit();

            const responseData = await JobRecuit.findByPk(newJobRecuit.id, {
                include: [{ model: JobSeeker, as: 'JobSeekers', include: [{ model: JobSeekerFile }] }]
            });
           
            return res.json({
                success: true,
                message: "Job recuit created successfully",
                data: responseData
            });
        }

    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}

/**
 * To get all job recuit 
 * @param {*send data success response} res 
 * @param {*if send data error} next 
 * @type mothod GET
 * @access pub
 * @returns 
 */
export const findJobRecuit = async (req, res, next) => {
    try {
        const jobRecuit = await JobRecuit.findAll({
            include: [{ model: JobSeeker, as: 'JobSeekers', include: [{ model: JobSeekerFile }] }]
        });
        if (!jobRecuit[0]) {
            throw createError.NotFound("Now job recuit is empty");
        }
        return res.json({
            success: true,
            message: "Get data all job recuit success",
            data: jobRecuit
        });
    } catch (error) {
        next(error);
    }
}

/**
 * To get one job recuit 
 * @param {*require id from request params} req 
 * @param {*send data success response} res 
 * @param {*if send data error} next 
 * @type mothod Get
 * @access public
 * @returns 
 */
export const findOneJobRecuit = async (req, res, next) => {
    const { id } = req.params;
    try {
        const jobRecuit = await JobRecuit.findByPk(id, {
            include: [{ model: JobSeeker, as: 'JobSeekers', include: [{ model: JobSeekerFile }] }]
        });
        if (!jobRecuit) {
            throw createError.NotFound(`job recuit does not exist. with ID:${id}`);
        }
        return res.json({
            success: true,
            message: "Get one job recuit success",
            data: jobRecuit
        });
    } catch (error) {
        next(error);
    }
}

/**
 * To delete job recuit 
 * @param {*require id from request params} req 
 * @param {*send data success response} res 
 * @param {*if send data error} next 
 * @type mothod DELETE
 * @access private
 * @returns 
 */
export const deleteJobRecuit = async (req, res, next) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();
    try {
        const jobRecuit = await JobRecuit.findByPk(id, { transaction: transaction });
        if (!jobRecuit) {
            throw createError.NotFound(`Job recuit does not exist. with ID:${id}`);
        }

        const jobSeeker = await JobSeeker.findOne({ where: { jobRecuitId: id } }, { transaction: transaction });
        if (!jobSeeker) {
            throw createError.NotFound(`Job seeker does not exist. with ID:${id}`);
        }

        const jobSeekerFile = await JobSeekerFile.findOne({ where: { jobSeekerId: id } }, { transaction: transaction });
        if (!jobSeekerFile) {
            throw createError.NotFound(`Job seeker file does not exist. with ID:${id}`);
        }

        await jobSeekerFile.destroy();
        await jobSeeker.destroy();
        await jobRecuit.destroy();
        await transaction.commit();
        return res.json({
            success: true,
            message: `Deleted job recuit with ID:${id} successfully`
        });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}