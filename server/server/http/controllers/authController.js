import ServiceRunner from '../../services/ServiceRunner';

const Verify = require('../../services/authentication/Verify');
const Authenticate = require('../../services/authentication/Authenticate');
const PassChange = require('../../services/authentication/PassChange');
const PublisherViewAuth = require('../../services/authentication/PublisherViewAuth');

module.exports = {
    verify           : ServiceRunner(Verify, req => req.header('Authorization'), false),
    authenticate     : ServiceRunner(Authenticate, req => req.body, false),
    passchange       : ServiceRunner(PassChange, req => req.body, false),
    publisherViewAuth: ServiceRunner(PublisherViewAuth, req => req.params.userId, false),
};
