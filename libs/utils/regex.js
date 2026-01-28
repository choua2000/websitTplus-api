import slugify from "slugify";

/**
 *  function regex email input
 * @param {*} email
 * @returns 
 */
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 *  function regex number input
 * @param {*} number 
 * @returns 
 */
function validateNumber(number) {
    var reg = /^\d+$/;
    return reg.test(number);
}

/**
 *  function regex slug input
 * @param {*required some string want to convert to slug} return slug
 * @returns 
 */
function makeSlugify(string) {
    if (!/^[a-zA-Z]+(\.[a-zA-z]+)?$/.test(string)) {
        return string
            .toString()
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/\-\-+/g, "-")
            .replace(/^-+/, "")
            .replace(/[\u0EB1\u0EB8-\u0EB9\u0EB4-\u0EB7\u0EBA-\u0EBB\u0EBC\u0EC8-\u0ECD]/g, "")
            .replace(/-+$/, "")
            .replace(/\\|\//g,'')  // remove slash, or, backslash
            .replace(/,/g, '')  // remove comma
            .replace(/\([^)]*\)|\[[^\]]*\]/g, '')  // remove Parentheses
            .replace(/\+/g, "-") // remove plus
            // .replace(/[\/\\]/g,'')
    }
    return slugify(string);
}

module.exports = {
    validateEmail,
    validateNumber,
    makeSlugify
}