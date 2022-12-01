import ServiceRunner from '../../services/ServiceRunner';
const AttachmentsService = require('../../services/attachments/index');
const { CDN } = require('../../modules/wbid/services/CDN/index');
const cdn = new CDN();

module.exports = {
    getAttachmentsList: ServiceRunner(AttachmentsService, req => {
        return { body: req.body }
    }),
    playerLoader: async (request, response, next) => {
        const { file } = request;
        const path = "vpl/adwmg_vpl.js";
        let url;
        const data = file.buffer.toString('utf8'); // file here
        try {
            url = await cdn.update(data, path);
        } catch (error) {
            console.error(error);
            throw error;
        }
        response.status(200).json({ url });
    },
};
