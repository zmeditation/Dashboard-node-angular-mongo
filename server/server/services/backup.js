const fs = require('fs');
const _ = require('lodash');
const exec = require('child_process').exec;
const path = require('path');

// Concatenate root directory path with our backup folder.
const backupDirPath = path.join(__dirname, '../../../../mongo_backup/');
const hostChecked = process.env.DATABASE.match(/@.*:/) ? 
                  process.env.DATABASE.match(/@.*:/)[0].replace(/@|:/g, '') : 
                  process.env.DATABASE.match(/@.*\//)[0].replace(/@|\//g, '');
const portChecked = process.env.DATABASE.match(/@.*:/) ? 
                    process.env.DATABASE.replace(/.*:|\/[a-zA-Z]*[0-9]*/g, '') :
                    '';
const dbOptions = {
  user: process.env.DATABASE.replace(/.*:\/\/|:.*/, '').replace(/:.*/, ''),
  pass: process.env.DATABASE.replace(/.*:\/\//, '').match(/.*@/)[0].replace(/.*:/, '').replace(/@/, ''),
  host: hostChecked,
  port: portChecked,
  database: process.env.DATABASE_NAME || process.env.DATABASE.replace(/.*\//, ''),
  autoBackup: true,
  removeOldBackup: true,
  keepLastDaysBackup: 7,
  autoBackupPath: backupDirPath
};
// return stringDate as a date object.
exports.stringToDate = dateString => {
  return new Date(dateString);
};

// Check if variable is empty or not.
exports.empty = mixedVar => {
  let undef, key, i, len;
  const emptyValues = [undef, null, false, 0, '', '0'];
  for (i = 0, len = emptyValues.length; i < len; i++) {
    if (mixedVar === emptyValues[i]) {
      return true;
    }
  }
  if (typeof mixedVar === 'object') {
    for (key in mixedVar) {
      return false;
    }
    return true;
  }
  return false;
};

// Auto backup function
exports.dbAutoBackUp = () => {
  console.log('Backup of database begins...')
  // check for auto backup is enabled or disabled
  if (dbOptions.autoBackup == true) {
    let date = new Date();
    let beforeDate, oldBackupDir, oldBackupPath;

    // Current date
    let currentDate = this.stringToDate(date);
    console.log(currentDate);
    let newBackupDir =
      currentDate.getFullYear() +
      '-' +
      (currentDate.getMonth() + 1) +
      '-' +
      currentDate.getDate();

    // New backup path for current backup process
    let newBackupPath = dbOptions.autoBackupPath + 'dump_' + newBackupDir;
    // check for remove old backup after keeping # of days given in configuration
    if (dbOptions.removeOldBackup == true) {
      beforeDate = _.clone(currentDate);
      // Substract number of days to keep backup and remove old backup
      beforeDate.setDate(beforeDate.getDate() - dbOptions.keepLastDaysBackup);
      oldBackupDir =
        beforeDate.getFullYear() +
        '-' +
        (beforeDate.getMonth() + 1) +
        '-' +
        beforeDate.getDate();
      // old backup(after keeping # of days)
      oldBackupPath = dbOptions.autoBackupPath + 'dump_' + oldBackupDir;
    }

    // Command for mongodb dump process
    let cmd = {
      command: 'mongodump',
      params: {
        host: ` --host ${ dbOptions.host }`,
        port: `${ dbOptions.port ? ' --port ' + dbOptions.port : '' }`,
        db: ` --db ${ dbOptions.database }`,
        username: ` --username ${ dbOptions.user }`,
        password: ` --password ${ dbOptions.pass }`,
        out: ` --out ${ newBackupPath }`
      }
    };
    let fullCmd = cmd.command;
    for (let i of Object.keys(cmd.params)) {
      fullCmd += cmd.params[i];
    }

    exec(fullCmd, (error, stdout, stderr) => {
      if (this.empty(error)) {
        console.log('...Backup of database ends.')
        // check for remove old backup after keeping # of days given in configuration.
        if (dbOptions.removeOldBackup == true) {
          if (fs.existsSync(oldBackupPath)) {
            exec('rm -rf ' + oldBackupPath, err => {});
            console.log('Old backup removed' + oldBackupPath);
          }
        }
      } else {
        console.error(error);
      }
    });
  }
};