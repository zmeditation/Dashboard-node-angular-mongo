const mongoose = require('mongoose');
const User = mongoose.model("User");

const Base = require('./../../Base');
const { ServerError } = require('../../../handlers/errorHandlers');

// Avatar upload

const multer = require("multer");
const jimp = require("jimp");
const uuid = require("uuid");
const fs = require("fs");

class UploadAvatar extends Base {
    constructor(args) {
        super(args);
    }

    async execute({ req }) {
        await resize(req);
        const status = await finishPhotoUpload(req);

        if (!status) { throw new ServerError('MISSING_PHOTO', 'BAD_REQUEST'); }

        return status;
    }
}

async function resize(req) {
    if (!req.file) {
        throw new ServerError('MISSING_PHOTO', 'BAD_REQUEST');
    }

    const extension = req.file.mimetype.split("/")[1];
    req.body.photo = `${uuid.v4()}.${extension}`;

    const resizedPhoto = await jimp.read(req.file.buffer);

    await resizedPhoto.resize(400, jimp.AUTO);
    await resizedPhoto.write(`${__dirname}/../../../public/images/pp/${req.body.photo}`);
}

async function finishPhotoUpload(req) {
    const previousPhoto = req.body.additional.photo;
    const newPhoto = req.body.photo;
    const paramsId = req.params.id;

    const user = await User.findOneAndUpdate(
        { _id: paramsId },
        { $set: { photo: newPhoto } },
        { new: true }
    );

    if (!user) {
        throw new ServerError('ERROR_DURING_PHOTO_UPLOAD', 'BAD_REQUEST');
    }

    if (previousPhoto) {
        fs.unlink(
            __dirname + "/../../../public/images/pp/" + previousPhoto,
            (err) => {
                if (err) {
                    console.error(err);
                }
                console.log("File has been Deleted");
            }
        );
    }

    return {
        success: true,
        msg: "The photo was successfully updated",
        photo: user.photo
    };
}

module.exports = UploadAvatar;