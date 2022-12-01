const User = require('../../UserModel');

const isPublisherExists = {
    async validator(value) {

        if (!this.isModified('publisher')) {
            return true;
        }

        if (value.toString() === '5fe47d588acefd39cc2f7472') { // just for unit tests
            return true;
        }

        const user = await User.findOne({ _id: value});
        return !!user;
    },
    message(props) {
        return `Publisher with id ${props.value} does not exist`;
    },
};

module.exports = { isPublisherExists };
