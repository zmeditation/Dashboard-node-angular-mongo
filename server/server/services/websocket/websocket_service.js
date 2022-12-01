const express = require('express');
const httpsService = express();
const serverIO = require('http').Server(httpsService);
const io = require('socket.io')(serverIO);
require('colors');

const findByRoles = require('../notifications/queries/findByRoles');
const pushNewMsgByIds = require('../notifications/queries/pushNewMsgByIds');
const renameKeysInArray = require('../helperFunctions/renameKeysInArray');
const buildErrorObj = require('../helperFunctions/buildErrorObj');
const { handleErrors } = require('../helperFunctions/handleErrors');

const endpoints = {
  ADMIN: '/admin',
  CEO: '/ceo',
  'AD OPS': '/adops',
  'SENIOR ACCOUNT MANAGER': '/senior-account',
  'ACCOUNT MANAGER': '/account',
  PUBLISHER: '/publisher',
  'MEDIA BUYER': '/media',
  'FINANCE MANAGER': '/finance'
};

class WebsocketConnection {
  constructor(port) {
    this.port = port;
  }

  start() {
    io.on('connection', (socket) => {
      // console.log(`Socket ${socket.id.green} connected`);

      socket.emit('id', socket.id);

      socket.on('set-user-data', (userData) => {
        socket.userData = userData;
      });

      socket.on('error', (err) => {
        // console.error(err.message || err);
      });

      socket.on('disconnect', () => {
        //  console.log(`Socket ${socket.id.red} disconnected`);
      });
    });

    for (const point of Object.values(endpoints)) {
      io.of(point).on('connection', (nsSocket) => {
        // console.log(`Socket ${nsSocket.id.green} notification connected`);

        nsSocket.on('error', (err) => {
          // console.error(err.message || err);
        });

        nsSocket.on('disconnect', () => {
          //  console.log(`Socket ${nsSocket.id.red} notification disconnected`);
        });
      });
    }

    serverIO.listen(this.port, (err) => {
      console.log(`Socket.io server started at port ${this.port}`);
      if (err) {
        console.log(`Error occurred when Socket.io server started: ${err.message}`);
      }
    });
  }

  sendProgress(data) {
    try {
      if (io.sockets.sockets[data.socketId] !== undefined) {
        io.sockets.sockets[data.socketId].emit('progress', data.percent);
      }
    } catch (error) {
      console.log(error.message || error);
    }
  }
}

const pushByIDViaSocket = (data) => {
  try {
    const { event, socketId, message, last, type } = data;
    if (io.sockets.sockets[socketId]) {
      io.sockets.sockets[socketId].emit(event, { message, last, type });
    }
  } catch (error) {
    console.log('pushByID', error.message || error);
  }
};

const sendSocketByRootPath = async (data) => {
  try {
    const { event, message, last } = data;
    io.emit(event, { eventName: event, message, last });
  } catch (error) {
    console.log('sendSocketByRootPath', error.message || error);
  }
};

const sendPersonalNotice = async (params) => {
  const beginOfError = 'Error to sendPersonalNotice';

  try {
    const { event, usersId, msg, msgType } = params;

    if (!event) {
      throw buildErrorObj('event is not exist');
    }

    const usersIdsArray = usersId.map((id) => ({ refs_to_user: id }));

    const { error: pushError, createdMsgs } = await pushNewMsgByIds(usersIdsArray, msgType, msg);

    if (pushError !== null) {
      throw pushError;
    }

    for (const soc of Object.values(io.sockets.sockets)) {
      if (soc.userData && usersId.includes(soc.userData.id)) {
        const nameSpace = endpoints[soc.userData.role];
        io.nsps[nameSpace].sockets[`${nameSpace}#${soc.id}`].emit(event, msg);
      }
    }

    return {
      error: null,
      createdMsgs
    };
  } catch (error) {
    return handleErrors(error, beginOfError);
  }
};

// find all users id by roles
// by all ids save msg in Notifications collection
const sendMsgByRoles = async (msgInfo) => {
  const beginOfError = 'Error in sendMsgByRoles';

  try {
    const { event, roleReceivers, message, msgType } = msgInfo;
    const returnValues = '_id';

    const { error: findRoleEr, usersIds } = await findByRoles(roleReceivers, returnValues);
    if (findRoleEr !== null) throw findRoleEr;

    const usersIdsArray = await renameKeysInArray(usersIds, 'refs_to_user', '_id');

    const { error: pushError, createdMsgs } = await pushNewMsgByIds(usersIdsArray, msgType, message);
    if (pushError !== null) {
      throw pushError;
    }

    roleReceivers.forEach((role) => {
      const nameSpace = endpoints[role];
      nameSpace && io.of(nameSpace).emit(event, message);
    });

    return {
      error: null,
      createdMsgs
    };
  } catch (error) {
    return handleErrors(error, beginOfError);
  }
};

module.exports = {
  WebsocketConnection,
  sendPersonalNotice,
  sendMsgByRoles,
  pushByIDViaSocket,
  sendSocketByRootPath
};
