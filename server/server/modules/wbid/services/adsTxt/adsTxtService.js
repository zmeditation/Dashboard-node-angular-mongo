const adsTxtService = (Service, requestData, isAdditionalRequired = true) => {
    return async (req, res) => {
        const options = {
            baseURL: "http://199.247.0.74:4444",
            chunked: false,
            url: "/pub",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: false,
            responseEncoding: 'utf8',
            transformRequest: [
                function transformRequest(data) {
                    return data ? JSON.stringify(data) : null;
                }],
            data: req.body
        };
        const serviceInstance = new Service({ args: requestData(req), isAdditionalRequired, options });
        const status = await serviceInstance.run();
        res.status(200).json(status);
    }
};

module.exports = adsTxtService;
