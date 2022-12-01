const mongoose = require('mongoose');
const User = mongoose.model('User');


exports.getPublishersFilter = async ( query ) => {
    const { findBy, options } = query;

    try {
        const filter = findBy.includes( "ALL" ) ? { 'enabled.status': true } : { role: findBy, 'enabled.status': true };

        return User.find(filter,
            `${options}`,
            (err) => {
                if (err) {
                    throw err ;
                }
            }
        );
    } catch (error) {
        console.log(error)
    }
}
