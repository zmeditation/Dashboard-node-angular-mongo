import ServiceRunner from '../../services/ServiceRunner';

const GetNoticesOfUser = require('../../services/notifications/GetNoticesOfUser/GetNoticesOfUser');
const DeleteNotice = require('../../services/notifications/DeleteNoticeOfUser/DeleteNoticeOfUser');
const DeleteNoticesCollections = require('../../services/notifications/DeleteNoticesCollections/DeleteNoticesCollections');
const CreateNotification = require('../../services/notifications/CreateNotification/CreateNotification');

module.exports = {
    getUserNotices           : ServiceRunner(GetNoticesOfUser, req => { return { body: req.body, userId: req.params.userId }}),
    deleteUserNotice         : ServiceRunner(DeleteNotice, req => { return { body: req.body, msgId: req.params.msgId }}),
    deleteNoticesCollections : ServiceRunner(DeleteNoticesCollections, req => { return { body: req.body, query: req.query }}),
    createNewNotification    : ServiceRunner(CreateNotification, req => { return { body: req.body }})
}
