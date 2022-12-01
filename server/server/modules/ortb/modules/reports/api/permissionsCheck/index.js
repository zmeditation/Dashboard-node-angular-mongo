const mongoose = require('mongoose');
const Users = mongoose.model('User');
const Base = require('../../../../../../services/Base');
const {ServerError} = require('../../../../../../handlers/errorHandlers');

class PermissionsCheck extends Base {
    constructor(args) {
        super(args);
    }

    async execute({body: {request: reportReq, additional: {permission, id: userToken}}}) {
        let result;
        try {
            switch (permission) {
                case 'canReadAllOrtbReports':
                    result = await this.getResults(reportReq);
                    break;
                case 'canReadOwnOrtbReports':
                    result = await this.getResults(reportReq);
                    break;
                default:
                    throw new ServerError('FORBIDDEN', 'FORBIDDEN');
            }
        } catch (err) {
            throw new ServerError('FORBIDDEN', 'FORBIDDEN');
        }
        return result;
    }

    checkUserPermissions(id) {
        const users = Users.find({_id: id});
        return users.then(async (user) => {
            const res = user[0].connected_users.p;
            await Users.find({_id: {$in: [user[0].connected_users.am]}}).then(am_users => {
                for (let i of am_users) {
                    i.connected_users.p.forEach(el => {
                        if (!res.includes(el)) {
                            res.push(el);
                        }
                    })
                }
            })
            return res;
        });
    }
}

module.exports = PermissionsCheck;
