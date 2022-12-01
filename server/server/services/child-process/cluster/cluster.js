const cluster = require('cluster');
const os = require('os');
const sendResultOfUploading = require('../../../modules/reporting/APIUpload/helperFunctions/sendResultOfUploading');
const www = '../../../bin/www';
const { pushByIDViaSocket, sendSocketByRootPath, sendPersonalNotice } = require('../../websocket/websocket_service');

class ClusterRunner {
  constructor() {}

  start() {
    if (cluster.isMaster) {
      // const cpusCount = os.cpus().length; /* this variable will create so many processes as CPU nodes */
      const cpusCount =  2; //os.cpus().length;
      // console.log(`Length of nodes in system is ${cpusCount}`);
      for (let i = 0; i < cpusCount - 1; i++) {
        const worker = cluster.fork();
        this.setHandlers(worker);
      }
    }
    if (cluster.isWorker) {
      require(www);
      const workerPid = cluster.worker.id;
      process.on('uncaughtException', (err) => {
        console.error(`${ new Date().toUTCString() } uncaught exception: ${ err.message }`);
        console.error(err.stack);
        process.exit(1);
      });
    }

    cluster.on('exit', (worker) => {
      console.log(`Worker ${ worker.process.pid } is dead. Trying to restart...`);
      cluster.fork();
    });
  }

  setHandlers(worker) {
    const wproc = worker.process;
    worker.on('disconnect', () => {
      console.log(`Worker-server #${ wproc.pid } has disconnected`);
    });
    wproc.on('message', this.messageHandler);
  }

  async messageHandler(message) {
    try {
      if (message.eventHandler) {
        const events = {
          push_to_all: sendSocketByRootPath,
          push_by_id: pushByIDViaSocket,
          reports: sendResultOfUploading,
          send_personal_notice: sendPersonalNotice
        };
        const runFunction = events[message.eventHandler];

        await runFunction(message.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  }
}

module.exports = ClusterRunner;
