var fs = require('fs');

export default function (directory) {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
    }

    return directory
}
