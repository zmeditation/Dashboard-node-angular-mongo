const User = require('mongoose').model('User');
const Base = require('./../../Base');
const { ROLES } = require("../../../constants/roles");

class SearchUsers extends Base {
    async execute({ body }) {
        const { search, pagination, select, additional } = body;
        const { permissions } = additional;
        const { page, perPage } = pagination;
        const permissionsCondition = await this.preparePermissionsCondition(permissions, select.role, additional);
        const conditions = {
            role: select.role,
            name: { $regex: new RegExp(search) },
            ...permissionsCondition
        };
        if (select.role === ROLES.PUBLISHER) {
            conditions.$and = conditions.$and || [];
            const am = { am: select.manager ? { $eq: select.manager } : { $ne: null } };
            conditions.$and.push(am);
        }

        const usersQuery = User.find(conditions)
            .select('name')
            .sort('name')
            .skip((page - 1) * perPage)
            .limit(perPage);

        const totalUsersQuery = User.find(conditions).countDocuments();
        const [users, total] = await Promise.all([usersQuery, totalUsersQuery]);

        return { pagination: { perPage, page, total, pages: Math.ceil(total / perPage) }, list: users };
    }

    async preparePermissionsCondition(permissions, requestedRole, data) {
        const result = {};
        const isSeniorAccountManager = permissions.includes('canReadAllPubs');
        const isAdmin = permissions.includes('canAddAllUsers');
        if (isAdmin) {
            return result;
        }
        if (isSeniorAccountManager) {
            if (requestedRole === ROLES.MANAGER) {
                result.sam = data.id;
            } else if (requestedRole === ROLES.PUBLISHER) {
                const managers = await User.find({ sam: data.id }, '_id');
                result.am = { $in: managers.map(manager => manager._id) };
            }
        }

        return result;
    }
}

module.exports = SearchUsers;
