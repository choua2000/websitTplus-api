import multer from 'multer';
import createError from 'http-errors';

// generate random number
function generateOTP() {
    // Declare a digits variable 
    // which stores all digits
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

const filename = (req, file, next) => {
    let lastIndexOf = file.originalname.lastIndexOf('.');
    let ext = file.originalname.substring(lastIndexOf);
    let number = generateOTP();
    next(null, `img-${Date.now()}${number}${ext}`);
}

const destination = (req, file, next) => {
    next(null, `${__dirname}/../public/images/`);
}

const upload = multer({
    storage: multer.diskStorage({
        destination, filename
    }),
    fileFilter: async (req, file, cb) => {

        // Check type file
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(createError.BadRequest('Only .png, .jpg and .jpeg format allowed!'));
        }
    },
});

export default upload;

// --------------> upload image package <------------
const packageImageDestination = (req, file, next) => {
    next(null, `${__dirname}/../public/images/package-images/`);
}

export const uploadPackageImage = multer({
    storage: multer.diskStorage({
        destination: packageImageDestination, filename
    }),
    fileFilter: async (req, file, cb) => {
        // Check type file
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(createError.BadRequest('Only .png, .jpg and .jpeg format allowed!'));
        }
    },
});

// ----------> upload image production <----------------
const productImageDestination = (req, file, next) => {
    next(null, `${__dirname}/../public/images/production-images/`);
}

export const uploadProductImage = multer({
    storage: multer.diskStorage({
        destination: productImageDestination, filename
    }),
    fileFilter: async (req, file, cb) => {

        // Check type file
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(createError.BadRequest('Only .png, .jpg and .jpeg format allowed!'));
        }
    },
});

// ----------> upload image post <----------------
const postImageDestination = (req, file, next) => {
    next(null, `${__dirname}/../public/images/post-images/`);
}

export const uploadPostImage = multer({
    storage: multer.diskStorage({
        destination: postImageDestination, filename
    }),
    fileFilter: async (req, file, cb) => {

        // Check type file
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(createError.BadRequest('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

// ----------> upload file job recuit <----------------
const filenameJob = (req, file, next) => {
    let lastIndexOf = file.originalname.lastIndexOf('.');
    let ext = file.originalname.substring(lastIndexOf);
    let number = generateOTP();
    next(null, `file-${Date.now()}${number}${ext}`);
}

const jobFileDestination = (req, file, next) => {
    next(null, `${__dirname}/../public/resources/uploads/`);
}

export const uploadFileJob = multer({
    storage: multer.diskStorage({
        destination: jobFileDestination, filename: filenameJob
    }),
    fileFilter: async (req, file, cb) => {

        // Check type file
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "application/pdf" || file.mimetype == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(createError.BadRequest('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

// ----------> upload banner <----------------

const banImageDestination = (req, file, next) => {
    next(null, `${__dirname}/../public/images/ban-images/`);
}

export const uploadBanImage = multer({
    storage: multer.diskStorage({
        destination: banImageDestination, filename
    }),
    fileFilter: async (req, file, cb) => {

        // Check type file
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(createError.BadRequest('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

// ----------> upload siteInfo <----------------

const siteInfoImageDestination = (req, file, next) => {
    next(null, `${__dirname}/../public/images/siteInfo-images/`);
}

export const uploadSiteInfoImage = multer({
    storage: multer.diskStorage({
        destination: siteInfoImageDestination, filename
    }),
    fileFilter: async (req, file, cb) => {

        // Check type file
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(createError.BadRequest('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});


// ----------> upload type package <---------
const typePackageImageDestination = (req, file, next) => {
    next(null, `${__dirname}/../public/images/typePackage-images/`);
}

export const uploadTypePackageImage = multer({
    storage: multer.diskStorage({
        destination: typePackageImageDestination, filename
    }),
    fileFilter: async (req, file, cb) => {

        // Check type file
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(createError.BadRequest('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});