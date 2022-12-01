const {CDN} = require("./index");
const cdn = new CDN();
const fse = require("fs-extra");
require("colors");

module.exports.uploadToCDN = async (file) => {
    let result = await cdn.upload(file);
    await fse.remove(file); // restore before prod release
    console.log(
        "File".green,
        `${result}`.red,
        "was uploaded to CDN.".green
    );
    return result;
};
