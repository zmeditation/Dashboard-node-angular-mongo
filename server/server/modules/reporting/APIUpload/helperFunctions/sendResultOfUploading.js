const { sendMsgByRoles } = require("../../../../services/websocket/websocket_service")

const sendResultOfUploading = async(msg) => {
    try {
        const msgInfo = {
            event: 'notifications',
            roleReceivers: ['ADMIN', 'SENIOR ACCOUNT MANAGER', 'ACCOUNT MANAGER', 'CEO', 'MEDIA BUYER'],
            message: msg,
            msgType: 'systemNf'
        }
    
        const { error: sendMsgEr } = await sendMsgByRoles(msgInfo);
        if (sendMsgEr !== null) { throw sendMsgEr};
        
        return { error: null };
    } catch (error) {
        console.log(error && error.msg ? error.msg : error.message);
    }               
}

module.exports = sendResultOfUploading;