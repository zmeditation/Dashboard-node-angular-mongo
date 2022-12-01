const fs = require("fs");
const fsPromise = fs.promises;
const path = require('path');

class HandleAnalyticsFiles {
  
  constructor(filePath) {
    this.filePath = filePath;
    this.folderPath = path.dirname(this.filePath);
    this.defaultData = this.getDefaultData();
  }
  
  async readFile() {
    const existPath = fs.existsSync(this.filePath);

    if (existPath) {
      const analytics = await fsPromise.readFile(this.filePath, 'utf8');
      const analyticsJSON = analytics || this.defaultData;
      
      return JSON.parse(analyticsJSON);
    }

    return false;
  }

  async writeFile(writeData = this.defaultData) {
    const isExistFolder = await this.isFolderPathExist();
    !isExistFolder && await this.writeFolder();

    await fsPromise.writeFile(this.filePath, writeData);
    return JSON.parse(this.defaultData);
  }

  async isFolderPathExist() {
    return fs.existsSync(this.folderPath);
  }

  async writeFolder() {
    return await fsPromise.mkdir(this.folderPath, { recursive: true })
  }

  getDefaultData() {
    const oldDateInMs = new Date(2020, 1).getTime();
    const defaultData = {
      analytics: [],
      last_update: oldDateInMs
    }
    
    return JSON.stringify(defaultData);
  }
}

module.exports = HandleAnalyticsFiles;