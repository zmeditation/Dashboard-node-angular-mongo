const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.getCommissionAndCurrentCwe =  async (id, userObject) => {
    const user = await User.findOne({ _id: id});
    if (!user['cwe']) {
        return { commission: userObject['commission'], cwe: true };
    } else {
        return{ commission: user['commission'], cwe: user['cwe'] };
    }
};
