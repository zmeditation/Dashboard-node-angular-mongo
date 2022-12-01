const WbidService = (Service, requestData, isAdditionalRequired = true) => {
    return async (req, res) => {
        let baseURL;

        if (process.env.WBID_SERVICE_ENDPOINT) {
            baseURL = `http://${process.env.WBID_SERVICE_ENDPOINT}/`;
        } else {
            baseURL = 'http://45.76.85.245:9999/'
        }
        /**
         * Add each baseURL variable to .env file of current environment, NODE_ENV
         */

        // switch (process.env.NODE_ENV) {
        //     case 'production':
        //         baseURL = ;
        //         break;
        //     case 'staging':
        //         baseURL = 'http://45.76.85.245:9999/';
        //         break;
        //     case 'development':
        //         baseURL = 'http://45.76.85.245:9999/'; // change dev url from http://localhost:9999/
        // }
        const options = {
            baseURL,
            chunked: false,
            url: req.body.path,
            method: req.body.method,
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: false,
            responseEncoding: 'utf8',
            params: req.body.id ? {id: req.body.id, name: req.body.name ? req.body.name : undefined} : null,
            transformRequest: [
                function transformRequest(data) {
                    return data ? JSON.stringify(data) : null;
                }],
            data: req.body ? req.body : null
        };
        const serviceInstance = new Service({args: requestData(req), isAdditionalRequired, options});
        const status = await serviceInstance.run();
        return res.status(200).json(status);
    }
};

module.exports = WbidService;
