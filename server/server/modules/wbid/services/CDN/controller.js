const {uploadToCDN} = require("./uploadToCDN");
const {deleteFromCDN} = require("./DeleteFromCDN");

exports.CDN = class {
    constructor() {
    }

    async uploadToCDN(file, socketId) {
        return uploadToCDN(file, socketId);
    }

    async deleteFromCDN(filename, socketId) {
        return deleteFromCDN(filename, socketId);
    }
};
