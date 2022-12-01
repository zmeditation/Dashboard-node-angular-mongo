const { NextManager } = require('./NextManager');

const nextManager = new NextManager();

const getNext = (req, res, next) => {
    nextManager.setNext(next);
    next();
}

module.exports = {
    getNext,
    nextManager
}