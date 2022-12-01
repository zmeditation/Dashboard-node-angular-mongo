const path = require('path');

module.exports = {
    fileDestination() {
        return path.join(__dirname, '../../../../dist/invoices/', this.fileName);
    }
}
