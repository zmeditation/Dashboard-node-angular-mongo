const Base = require("../../Base");
const { ERRORS } = require("../../../constants/errors");
const mongoose = require("mongoose");
const User = mongoose.model("User");

class GetOwnManagers extends Base {
    async execute({ body }) {
        const { id } = body.additional;
        const toPopulate = [{ path: 'am', select: '_id name' }, { path: 'sam', select: '_id name' }];

        let user;
        try {
            user = await User.findById(id).populate(toPopulate);
            if (!user) {
                throw new ServerError(`User by id ${ id } not founded.`, ERRORS.NOT_FOUND);
            }
        } catch (error) {
            console.error(error);
            throw error;
        }

        return { accountManager: user.am, seniorManager: user.sam };
    };
}

module.exports = { GetOwnManagers };
