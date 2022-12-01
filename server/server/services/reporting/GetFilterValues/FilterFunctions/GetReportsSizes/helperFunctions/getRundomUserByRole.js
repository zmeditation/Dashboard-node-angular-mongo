
const User = require('../../../../../../database/mongoDB/migrations/UserModel');

const getRandomUserByRole = async(role) => {
    const user = await User.findOne({ role, _id: { $type: 'objectId' }}, '_id');
    return user._id;
}

module.exports = getRandomUserByRole;
