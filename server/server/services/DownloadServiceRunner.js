const DownloadServiceRunner = (Service, requestData, isAdditionalRequired = true) => {
    return async (req, res) => {
        const serviceInstance = new Service({ args: requestData(req), isAdditionalRequired });
        const status = await serviceInstance.run();

        res.download(status.downloadUrl, status.name);
    }
};

module.exports = DownloadServiceRunner;