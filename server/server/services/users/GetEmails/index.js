const mongoose = require('mongoose');
const Users = mongoose.model('User');

class GetUsersEmails {
  constructor(params) {
    const { args: { req: { query } } } = params;
    this.query = query;
  }

  async run() {
    const { status } = this.query
    const query = {
      ...(status && { 'enabled.status': !!parseInt(status) }),
      'role': 'PUBLISHER'
    }

    const list = await Users.aggregate([
      { $match: query },
      { $group: {
          "_id": "$_id",
          "name": { $max: "$name" },
          "email": { $max: "$email" }
      } },
      { $project: { name: 1, email: 1, _id: 0 } }
    ]);
    return list;
  }
}

module.exports = GetUsersEmails;
