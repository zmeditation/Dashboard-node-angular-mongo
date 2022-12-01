const jsonExport = require('jsonexport');
const fs = require('fs');
const { array } = require('../../utilities/array');
const mongoose = require('mongoose');
const uuidV4 = require('uuid/v4');
const moment = require('moment');
const User = mongoose.model('User');

class FileExport {
  constructor(usedId) {
    this.path = `${__dirname}/../../../dist/exported`;
    this.id = uuidV4();
    this.date = moment().format('YYYY-MM-DD');
    this.userId = usedId;
  }

  create(queryResults, total) {
    const flatObjectArray = queryResults.map((result) => {
      const date = result['date'] !== 'total' ? { date: result['date'] } : {};
      return { ...date, ...result['dimensions'], ...result['metrics'] };
    });
    total.date = {};
    flatObjectArray.push(total);
    jsonExport(array.sortBy(flatObjectArray, { prop: 'date' }), (err, csv) => {
      if (err) return console.log(err);

      User.findOne({ _id: this.userId }).then((user) => {
        const path = `${this.path}/${user.generatedReport}.csv`;

        if (user.generatedReport && fs.existsSync(path)) {
          fs.unlinkSync(path);
        }

        fs.writeFile(`${this.path}/${this.id}.csv`, csv, (err) => {
          if (err) throw err;
          user.generatedReport = this.id;
          user.save({ validateBeforeSave: false });
        });
      });
    });
  }
}

module.exports = FileExport;
