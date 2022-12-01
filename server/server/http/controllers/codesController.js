const fs = require('fs').promises;
const path = require('path')
const mime = require('mime-types');
const { ERRORS } = require('../../constants/errors');
const { codeModel } = require('../../modules/codes/database/models');
const { ServerError } = require('../../handlers/errorHandlers');
const { Op } = require("sequelize");
const { CDN } = require('../../modules/wbid/services/CDN/controller');
const cdn = new CDN();

function wrapCode(code) {
  return `(()=>{return ${ code })()`
}

module.exports = {
  getAll: async (request, response) => {
    const codes = await codeModel.findAll();
    response.send(codes);
  },
  getAllCodesByPublisher: async (request, response) => {
    const { publisher } = request.params;
    const codes = await codeModel.findAll({
      where: {
        pub_id: {
          [Op.eq]: publisher
        }
      }
    });
    response.send(codes);
  },
  addCode: async (request, response) => {
    const { code, site, pub_id, type } = request.body;
    const hash = (Math.random() + 1).toString(36).substring(5);
    const wrapped = wrapCode(code);
    const filepath = `${ __dirname + '../../../dist/codes' }/adwmg-${ site }-${ type }-${ hash }.js`;
    await fs.writeFile(filepath, wrapped, 'utf-8');
    const CDNLink = await cdn.uploadToCDN(filepath);
    const result = await codeModel.create({ link: CDNLink, settings: code, pub_id, type });
    if (result) {
      return response.send({
        success: true,
        code: `<script src="${ CDNLink }" data-script-id="${ hash }" async></script>`
      })
    }
    response.send({ success: false, code: null })
  },
  updateCode: async (request, response) => {
    const { id, code, link } = request.body;
    const filename = link.split('/')[4];
    const hash = filename.split('-')[3].slice(0, 8);
    const wrapped = wrapCode(code);
    const filepath = `${ __dirname + '../../../dist/codes' }/${ filename }.js`;
    await fs.writeFile(filepath, wrapped, 'utf-8');
    await cdn.uploadToCDN(filepath);
    const result = await codeModel.update({ settings: code }, { where: { id } });
    if (result) {
      return response.send({
        success: true,
        code: `<script src="${ link }" data-script-id="${ hash }" async></script>`
      })
    }
    response.send({ success: false, code: null })
  }

}
