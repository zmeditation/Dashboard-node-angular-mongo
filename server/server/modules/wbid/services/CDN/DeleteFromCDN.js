const { CDN } = require("./index");
const cdn = new CDN();
require("colors");

module.exports.deleteFromCDN = async (filename) => {
  try {
    await cdn.delete(filename.substring(filename.lastIndexOf("/") + 1));
    console.log(
      "Old file".green,
      `${filename}`.red,
      "was removed from CDN.".green
    );
    return 'Success';
  } catch (e) {
    console.log(e.message || e);
  }
};
