import { JobApplication, ApplicantEducation, ApplicantTraining, ApplicantWorkExperience, ApplicationDocument, Job, ApplicantReference, ApplicationImage, TypeJob, sequelize } from "../models";
import createError from "http-errors";
import { createJobApplicationSchema } from "../validators/job_application.validator";
import { Op } from "sequelize";


export const createJobApplication = async (req, res, next) => {
    const transaction = await sequelize.transaction();

    try {
        // 1️⃣ normalize phone 
        if (req.body.contact_number !== undefined) {
            req.body.contact_number = String(req.body.contact_number).trim();
        }

        // 2️⃣ check duplicate with DB lock (race-condition safe)
        const existing = await JobApplication.findOne({
            where: {
                [Op.or]: [
                    { email: req.body.email },
                    { contact_number: req.body.contact_number }
                ]
            },
            attributes: ["email", "contact_number"],
            transaction,
            lock: transaction.LOCK.UPDATE
        });

        if (existing) {
            if (existing.email === req.body.email) {
                throw createError.BadRequest("Email already exists");
            }
            if (existing.contact_number === req.body.contact_number) {
                throw createError.BadRequest("Phone already exists");
            }
        }

        // 3️⃣ handle uploads 
        if (req.files?.length) {
            const images = [];

            for (const file of req.files) {
                // 🔐 basic file security
                if (!file.mimetype.startsWith("image/") && file.fieldname === "images") {
                    throw createError.BadRequest("Invalid image file type");
                }

                if (file.size > 5 * 1024 * 1024) {
                    throw createError.BadRequest("File too large (max 5MB)");
                }

                if (file.fieldname === "images") {
                    images.push({ image: "/resources/uploads/" + file.filename });
                } else if (file.fieldname === "document") {
                    req.body.document = "/resources/uploads/" + file.filename;
                } else if (file.fieldname === "signature") {
                    req.body.signature = "/resources/uploads/" + file.filename;
                } else if (file.fieldname === "photo_url") {
                    req.body.photo_url = "/resources/uploads/" + file.filename;
                }
            }

            if (images.length) req.body.images = images;
        }

        // 4️⃣ safe JSON parse 
        const safeParse = (value, field) => {
            if (typeof value !== "string") return value;
            if (!value || value === "null") return null;

            try {
                return JSON.parse(value);
            } catch {
                throw createError.BadRequest(`Invalid ${field} JSON`);
            }
        };

        ["educations", "workExperiences", "trainings", "reference"]
            .forEach(k => req.body[k] = safeParse(req.body[k], k));

        // 5️⃣ check job exists 
        const job = await Job.findByPk(req.body.job_id, { transaction });
        if (!job) throw createError.NotFound("Job not found");

        // 6️⃣ Joi validation 
        const body = await createJobApplicationSchema.validateAsync(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        //7️⃣ remove nullable relations to prevent Sequelize null insert 
        ["trainings", "workExperiences", "reference"]
            .forEach(k => { if (!body[k]) delete body[k]; });

        //8️⃣ create application 
        const jobApplication = await JobApplication.create(body, {
            include: [
                { model: ApplicantEducation, as: "educations" },
                { model: ApplicantTraining, as: "trainings" },
                { model: ApplicantWorkExperience, as: "workExperiences" },
                { model: ApplicantReference, as: "reference" },
                // { model: ApplicationImage, as: "images" }
            ],
            transaction
        });

        await transaction.commit();

        return res.json({
            success: true,
            message: "Job application created successfully",
            data: jobApplication
        });

    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

//MEAN : find job all application 

export const findJobApplication = async (req, res, next) => {
    try {
        // pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // total count
        const count = await JobApplication.count();

        // query data
        const jobApplication = await JobApplication.findAll({
            limit,
            offset,
            attributes: { exclude: ["updatedAt"] }, // hide unnecessary
            include: [
                {
                    model: Job,
                    as: "job",
                    attributes: ["id", "title", "description", "company"],
                    include: [
                        {
                            model: TypeJob,
                            as: "TypeJobs",
                            attributes: ["name"]
                        }
                    ]
                },
                { model: ApplicantEducation, as: "educations", attributes: { exclude: ["updatedAt"] } },
                { model: ApplicantTraining, as: "trainings", attributes: { exclude: ["updatedAt"] } },
                { model: ApplicantWorkExperience, as: "workExperiences", attributes: { exclude: ["updatedAt"] } },
                { model: ApplicantReference, as: "reference", attributes: { exclude: ["updatedAt"] } }
            ],
            order: [["status", "ASC"]],

        });

        return res.json({
            success: true,
            message: "Job application found successfully",
            page,
            limit,
            total: count,
            data: jobApplication
        });

    } catch (error) {
        next(error);
    }
};

//MEAN : find job application by id

export const findJobApplicationById = async (req, res, next) => {
    try {
        const jobApplication = await JobApplication.findByPk(req.params.id, {
            include: [
                {
                    model: Job,
                    as: 'job',
                    attributes: ['id', 'title', 'company', 'description'],
                    include: [{ model: TypeJob, as: 'TypeJobs', attributes: ['id', 'name'] }]
                },
                { model: ApplicantEducation, as: 'educations', attributes: ['university_name', 'qualification', 'major'] },
                { model: ApplicantTraining, as: 'trainings', attributes: ['company_name', 'department', 'duration'] },
                { model: ApplicantWorkExperience, as: 'workExperiences', attributes: ['position', 'employer_name', 'from_to'] },
                { model: ApplicantReference, as: 'reference', attributes: ['ref_name', 'ref_occupation'] },
            ]
        });

        if (!jobApplication) {
            throw createError.NotFound("Job application not found.");
        }

        return res.json({
            success: true,
            message: "Job application found successfully",
            data: jobApplication
        });
    } catch (error) {
        next(error);
    }
};




//mean :get data split by status

const getJobApplicationsByStatus = async (status, page = 1, limit = 10) => {
    const offset = (page - 1) * limit;

    const { count, rows } = await JobApplication.findAndCountAll({
        where: { status },
        limit,
        offset,
        attributes: { exclude: ["updatedAt"] },
        include: [
            {
                model: Job,
                as: "job",
                attributes: ["id", "title"],
                include: [
                    {
                        model: TypeJob,
                        as: "TypeJobs",
                        attributes: ["name"],
                    },
                ],
            },
            { model: ApplicantEducation, as: "educations", attributes: { exclude: ["updatedAt"] } },
            { model: ApplicantTraining, as: "trainings", attributes: { exclude: ["updatedAt"] } },
            { model: ApplicantWorkExperience, as: "workExperiences", attributes: { exclude: ["updatedAt"] } },
            { model: ApplicantReference, as: "reference", attributes: { exclude: ["updatedAt"] } },
        ],
        order: [["createdAt", "DESC"]],
    });

    return { count, rows };
};
//MEAN : get status pending

export const findPendingApplications = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const { count, rows } = await getJobApplicationsByStatus("pending", page, limit);

        return res.json({
            success: true,
            message: "Pending applications fetched successfully",
            page,
            limit,
            total: count,
            data: rows,
        });
    } catch (error) {
        next(error);
    }
};
//MEAN : get status approved and rejected (not pending)

export const findRejectedApplications = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await JobApplication.findAndCountAll({
            where: { status: { [Op.in]: ['approved', 'rejected'] } },
            limit,
            offset,
            attributes: { exclude: ["updatedAt"] },
            include: [
                {
                    model: Job,
                    as: "job",
                    attributes: ["id", "title"],
                    include: [
                        {
                            model: TypeJob,
                            as: "TypeJobs",
                            attributes: ["name"],
                        },
                    ],
                },
                { model: ApplicantEducation, as: "educations", attributes: { exclude: ["updatedAt"] } },
                { model: ApplicantTraining, as: "trainings", attributes: { exclude: ["updatedAt"] } },
                { model: ApplicantWorkExperience, as: "workExperiences", attributes: { exclude: ["updatedAt"] } },
                { model: ApplicantReference, as: "reference", attributes: { exclude: ["updatedAt"] } },
            ],
            order: [["status", "ASC"]],
        });

        return res.json({
            success: true,
            message: "Approved and rejected applications fetched successfully",
            page,
            limit,
            total: count,
            data: rows,
        });
    } catch (error) {
        next(error);
    }
};

// mean : change status application

export const changeStatusApplication = async (req, res, next) => {
    const transaction = await sequelize.transaction();

    try {
        const { id } = req.params;
        const { status } = req.body;

        // 1️⃣ validate status
        const allowedStatuses = new Set(['pending', 'approved', 'rejected']);

        if (!allowedStatuses.has(status)) {
            throw createError.BadRequest(
                `Invalid status. Allowed values: ${[...allowedStatuses].join(', ')}`
            );
        }

        // 2️⃣ find application
        const jobApplication = await JobApplication.findByPk(id, { transaction });

        if (!jobApplication) {
            throw createError.NotFound("Job application not found.");
        }

        // 3️⃣ update status
        await jobApplication.update({ status }, { transaction });

        // 4️⃣ reload ONLY updated record with relations
        const fullData = await JobApplication.findByPk(id, {
            include: [
                {
                    model: Job,
                    as: 'job',
                    attributes: ['title', 'company', 'description'],
                    include: [
                        {
                            model: TypeJob,
                            as: 'TypeJobs',
                            attributes: ['name']
                        }
                    ]
                },
                { model: ApplicantEducation, as: 'educations', attributes: { exclude: ['updatedAt'] } },
                { model: ApplicantTraining, as: 'trainings', attributes: { exclude: ['updatedAt'] } },
                { model: ApplicantWorkExperience, as: 'workExperiences', attributes: { exclude: ['updatedAt'] } },
                { model: ApplicantReference, as: 'reference', attributes: { exclude: ['updatedAt'] } },
            ],
            transaction
        });

        await transaction.commit();

        return res.status(200).json({
            success: true,
            message: `Job application status changed to '${status}' successfully`,
            data: fullData,
        });

    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

