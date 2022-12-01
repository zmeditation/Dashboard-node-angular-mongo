const Base = require('./../Base');
const fs = require('fs');
const attachmentsDir = `${__dirname}/../../public/attachments`;

class AttachmentsService extends Base {
  constructor(args) {
    super(args);
  }

  async execute(args) {
    const listOfAttachments = await this.getAttachmentsList(attachmentsDir);

    return {
      success: true,
      result: listOfAttachments
    };
  }

  async getAttachmentsList(dir) {
    const result = fs.readdirSync(dir);
    return result;
  }
};

module.exports = AttachmentsService;