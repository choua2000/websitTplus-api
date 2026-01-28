import bcrypt from 'bcrypt'

/**
 * function hashPassword
 * @param {String} password
 */
export const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash
}

/**
 * function comparePassword
 * @param {String} Entered -> password
 * @param {String} hashPassword -> in database
 */
export const comparePassword = (password, hashedPassword) => {
    const passwordMatch = bcrypt.compareSync(password, hashedPassword);
    return passwordMatch
}

export const hashOTP = (otp) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(otp, salt);
    return hash;
}

export const compareOTP = (otp, hashOTP) => {
    const otpMatch = bcrypt.compareSync(otp, hashOTP);
    return otpMatch;
}