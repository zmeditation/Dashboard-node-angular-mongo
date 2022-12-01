/** @format */
const validator = require('validator');

const isValidEmail = {
  validator(value) {
    return validator.isEmail(value);
  },
  message(props) {
    return `Email - ${props.value} - not valid.`;
  },
};

const isUniqueEmail = {
  async validator(value) {
    const Users = this.model('User');
    const isExist = await Users.findOne({ email: value });
    return !isExist;
  },
  message(props) {
    return `Email - ${props.value} - already exist.`;
  },
};

module.exports = {
  isValidEmail,
  isUniqueEmail,
};
