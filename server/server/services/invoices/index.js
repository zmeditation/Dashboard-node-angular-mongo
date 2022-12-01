const {sendPersonalNotice, sendMsgByRoles} = require('../websocket/websocket_service.js');

module.exports.invoicesInformerService = async (usersId, message) => {
    const msgInfo = {
        event: 'notifications',
        usersId,
        msg: message,
        msgType: 'billingNf'
    }

    const {error: sendMsgEr} = await sendPersonalNotice(msgInfo);

    if (sendMsgEr) {
        throw sendMsgEr;
    } else {
        return {error: null}
    }
}

module.exports.groupInvoiceInformerService = async (role, message) => {
    const msgInfo = {
        event: 'notifications',
        roleReceivers: Array.isArray(role) ? role : [role],
        message,
        msgType: 'billingNf'
    }

    const {error: sendMsgEr} = await sendMsgByRoles(msgInfo);
    if (sendMsgEr) {
        throw sendMsgEr;
    } else {
        return {error: null}
    }
}
