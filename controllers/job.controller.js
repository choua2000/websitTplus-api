import { Job, sequelize, TypeJob } from "../models";
import createError from 'http-errors';
import { createJobSchema, updateJobSchema } from '../validators/job.validator';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
dayjs.extend(utc);
dayjs.extend(timezone);

// MEAN : create job
export const createJob = async (req, res, next) => {
    const transaction = await sequelize.transaction();

    try {

        // 1️⃣ handle upload files
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                if (file.fieldname === 'logo_url') {
                    req.body.logo_url = "/resources/uploads/" + file.filename;
                } else if (file.fieldname === 'image_details') {
                    req.body.image_details = "/resources/uploads/" + file.filename;
                }
            });
        }

        // 2️⃣ check type job exists
        const typeJob = await TypeJob.findOne({
            where: { id: req.body.type_job_id }
        });

        if (!typeJob) {
            throw createError.NotFound("Type job not found.");
        }

        // 3️⃣ validate body
        const body = await createJobSchema.validateAsync(req.body);

        // 4️⃣ check duplicate job title
        const checkName = await Job.findOne({
            where: { title: body.title }
        });

        if (checkName) {
            throw createError.BadRequest("Job name already exists.");
        }

        // 5️⃣ calculate start date and end date not create if start_date > end_date
        if (body.start_date > body.end_date) {
            throw createError.BadRequest("Start date must be less than or equal to end date.");
        }

        // 6️⃣ create job
        const job = await Job.create({
            type_job_id: body.type_job_id,
            title: body.title,
            company: body.company,
            logo_url: body.logo_url,
            image_details: body.image_details,
            location: body.location,
            description: body.description,
            type: body.type,
            salary: body.salary,
            start_date: body.start_date,
            end_date: body.end_date,
            is_active: body.is_active,
        }, { transaction });

        await transaction.commit();

        return res.json({
            success: true,
            message: "Job created successfully",
            data: job
        });

    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

// MEAN : format posted time

const formatPostedTime = (seconds) => {
    const intervals = [
        { label: "Month", sec: 30 * 24 * 60 * 60 },
        { label: "Day", sec: 24 * 60 * 60 },
        { label: "Hour", sec: 60 * 60 },
        { label: "Minute", sec: 60 },
    ];
    if (seconds < 60) return "Just now";
    const interval = intervals.find(i => seconds >= i.sec);
    const value = Math.floor(seconds / interval.sec);
    return `${value} ${interval.label}${value > 1 ? "s" : ""} ago`;
};


const getRemainingTime = (seconds) => {
    if (seconds <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return { days, hours, minutes, seconds: secs };
};


// MEAN : find all job
export const findAllJob = async (req, res, next) => {
    try {
        const jobs = await Job.findAll({
            where: { is_active: 1 },
            include: [{ model: TypeJob, as: "TypeJobs", attributes: ["name"] }],
            order: [["createdAt", "DESC"]],
        });
        const now = dayjs();

        const jobsWithTime = jobs.map((job) => {
            const postedTime = dayjs(job.createdAt);
            const endTime = dayjs(job.end_date);
            const elapsedSeconds = now.diff(postedTime, "second");
            const remainingSeconds = endTime.diff(now, "second");

            return {
                ...job.toJSON(),
                posted_text: formatPostedTime(elapsedSeconds),
                // remaining_time: getRemainingTime(remainingSeconds),
                is_expired: remainingSeconds <= 0,
            };
        });

        return res.status(200).json({
            success: true,
            message: "Find all job successfully.",
            count: jobsWithTime.length,
            data: jobsWithTime,
        });
    } catch (error) {
        next(error);
    }
};

// MEAN : update job is_active
export const getIsActive = async (req, res, next) => {
    try {
        const jobs = await Job.findAll({
            include: [{ model: TypeJob, as: "TypeJobs", attributes: ["name"] }],
            order: [["is_active", "DESC"]],
        });
        if (!jobs) {
            throw createError.NotFound("Job not found.");
        }

        // Toggle is_active
        // await job.update({ is_active: !job.is_active }, { transaction });
        // await transaction.commit();

        // Return all jobs ordered by is_active DESC (active first)
        // const jobs = await Job.findAll({
        //     include: [{ model: TypeJob, as: "TypeJobs", attributes: ["name"] }],
        //     order: [["is_active", "DESC"], ["createdAt", "DESC"]],
        // });

        return res.json({
            success: true,
            message: `Job is_active get successfully`,
            data: jobs,
        });

    } catch (error) {
        next(error);
    }
};

// MEAN : find job by id
export const findJobById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const job = await Job.findOne({
            where: { id },
            attributes: {
                exclude: ["updatedAt"]
            },
            include: [{ model: TypeJob, as: "TypeJobs", attributes: ["name"] }],
        });

        if (!job) {
            throw createError.NotFound("Job not found.");
        }

        const now = dayjs();

        const posted = dayjs(job.createdAt);
        const end = dayjs(job.end_date);

        const elapsedSeconds = now.diff(posted, "second");
        const remainingSeconds = end.diff(now, "second");

        const jobWithTime = {
            ...job.toJSON(),

            posted_text: formatPostedTime(elapsedSeconds),
            is_expired: remainingSeconds <= 0,
        };

        return res.status(200).json({
            success: true,
            data: jobWithTime,
        });
    } catch (error) {
        next(error);
    }
};




// MEAN : update job
export const updateJob = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    const { id } = req.params; // use body since route is /update-job with no param
    try {
        // If route is /update/:id, we should usually take id from params and override body.id
        // But user request didn't specify. Standard REST is PUT /jobs/:id. 
        // Let's assume passed in body for now as validator has it required.

        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                if (file.fieldname === 'logo_url') {
                    req.body.logo_url = "/resources/uploads/" + file.filename;
                } else if (file.fieldname === 'image_details') {
                    req.body.image_details = "/resources/uploads/" + file.filename;
                }
            });
        }

        const body = await updateJobSchema.validateAsync(req.body);


        const job = await Job.findByPk(id);
        if (!job) {
            throw createError.NotFound("Job not found.");
        }

        if (body.type_job_id) {
            const typeJob = await TypeJob.findOne({
                where: {
                    id: body.type_job_id
                }
            });
            if (!typeJob) {
                throw createError.NotFound("Type job not found.");
            }
        }

        await job.update({
            type_job_id: body.type_job_id,
            title: body.title,
            company: body.company,
            logo_url: body.logo_url,
            image_details: body.image_details,
            location: body.location,
            description: body.description,
            type: body.type,
            salary: body.salary,
            start_date: body.start_date,
            end_date: body.end_date,
            is_active: body.is_active,
        }, { transaction });
        await transaction.commit();

        return res.json({
            success: true,
            message: "Job updated successfully",
            data: job
        });

    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}

// MEAN : delete job
export const deleteJob = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    const { id } = req.params;
    try {
        const job = await Job.findByPk(id);
        if (!job) {
            throw createError.NotFound("Job not found.");
        }

        await job.destroy({ transaction });
        await transaction.commit();

        return res.json({
            success: true,
            message: "Job deleted with id " + id + " successfully ",
        });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}


