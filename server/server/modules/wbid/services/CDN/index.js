const AWS = require("aws-sdk"),
    fs = require("fs");

exports.CDN = class {
    constructor() { 
        this.s3 = new AWS.S3({apiVersion: "2006-03-01"});
    }

    upload(filepath) {
        let data = fs.readFileSync(filepath, "utf8");
        return new Promise((response, reject) => {
            this.s3.putObject(
                {
                    Bucket: "wmgcontentdelivery/js",
                    Key: filepath.substring(filepath.lastIndexOf("/") + 1),
                    Body: data
                },
                (err, data) => {
                    if (err) {
                        console.log(err);
                        reject(err.stack);
                    } else {
                        response(
                            `https://d3f4nuq5dskrej.cloudfront.net/js/${filepath.substring(
                                filepath.lastIndexOf("/") + 1
                            )}`
                        );
                    }
                }
            );
        });
    }

    async delete(filepath) {
        return new Promise((response, reject) => {
            this.s3.deleteObject(
                {Bucket: "wmgcontentdelivery/js", Key: filepath},
                (err, data) => {
                    if (err) {
                        console.log(err);
                        reject(err.stack);
                    } else {
                        response(data);
                    }
                }
            );
        });
    }

    async update(file, path) {
        return new Promise((response, reject) => {
            this.s3.putObject(
                {
                    Bucket: "wmgcontentdelivery/js",
                    Key: path,
                    Body: file
                },
                (err, data) => {
                    if (err) {
                        console.log(err);
                        reject(err.stack);
                    } else {
                        response(
                            `https://d3f4nuq5dskrej.cloudfront.net/js/${path}`
                        );
                    }
                }
            );
        });
    }
};
