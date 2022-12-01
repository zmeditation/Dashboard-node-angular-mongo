const io = require("socket.io-client");
const {WebsocketConnection, pushByIDViaSocket} = require('../../../../services/websocket/websocket_service');

const socketUrl = process.env.WBID_SOCKET_ENDPOINT;

// switch (process.env.NODE_ENV) {
//     case 'production':
//         socketUrl = 'http://45.76.85.95:7777/';
//         break;
//     case 'staging':
//         socketUrl = 'http://45.76.85.245:7777/';
//         break;
//     case 'development':
//         socketUrl = 'http://localhost:7777/';
// }
class ClientSocket {
    constructor(port) {
        this.server = new WebsocketConnection(port);
        this.event = 'console';
    }
    start() {
        this.server.start();
        this.socket = io.connect(socketUrl, {reconnect: true});

        this.socket.on('console', (data) => {
            data.event = this.event;
            pushByIDViaSocket(data);
        });

        this.socket.on('progress', (data) => {
            this.server.sendProgress(data);
        });

        this.socket.on('prebid dfp integration', (data) => {
            data.event = this.event;
            pushByIDViaSocket(data);
        });
    }

}

module.exports = ClientSocket;
