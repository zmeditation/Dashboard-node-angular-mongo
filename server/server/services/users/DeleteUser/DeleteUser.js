const { canDeleteAllUsers } = require('./deleteUserSmaller');
const Base = require('./../../Base');
const { ServerError } = require('../../../handlers/errorHandlers');

// GET: api/users/delete/:id
// deletes a specific user in the DB.

class DeleteUser extends Base {
    constructor(args) {
        super(args);
    }

    async execute({ body: { additional: { permission }}, paramsId }) {
        if (!permission && permission !== "canDeleteAllUsers") {
            throw new ServerError('FORBIDDEN', 'FORBIDDEN')
        }

        const status = await canDeleteAllUsers(paramsId);

        if (!status) { throw new ServerError('ERROR_DURING_REQUEST', 'BAD_REQUEST')}

        return {
            success: true,
            msg: 'USER_DELETED'
        }
    }
}

module.exports = DeleteUser;