const { ERRORS, ERROR_CODES } = require("../constants/errors");
const { responseByStatusCode } = require("./handleErrorByStatus");
const { ErrorLogger } = require('./error/errorLogger');
class ServerError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ServerError";
    this.status = status;
  }
}

const catchRouterErrors = (error, req, res, next) => {
  if (error) {
    const { status, message } = error;
    const errorLogger = new ErrorLogger(error);

    errorLogger.logError();
    errorLogger.logStack();
    // let stackList = error.stack.match(/.*at.*server\\server\\.*([0-9][0-9]|[0-9]):([0-9][0-9]|[0-9])\)/gi),
    //     stackCount = 0;
    // if (!stackList.length) {
    //   stackList = ['Problem with modules and synchronize, not in project.'];
    // }
    // if (process.env.NODE_ENV === 'development') {
    //   console.log('∨∨∨ !!! DEBUG LOG FROM ERROR HANDLER !!! ∨∨∨');
    //   console.error(error);
    //   console.log('∧∧∧ !!! DEBUG LOG FROM ERROR HANDLER !!! ∧∧∧');
    // }

    // stackList.forEach(el => {
    //   console.error(`STACK TO ERROR --> ${++stackCount}`, el.trim());
    // });

    if (error.statusCode) {
      responseByStatusCode(error, req, res, next);
      return;
    }
    if (error.code === 'ENOENT') {
      return res.status(404).json({success: false, msg: 'File not found'})
    }
    if (error._message && error._message.includes('validation')) {
      return res.status(422).json({success: false, msg: message});
    }
    if (error.name === 'MongoError') {
      switch (error['codeName']) {
        case 'Location16819':
          res.status(400).json({success: false, msg: error['errmsg']});
          break;
        default:
          res.status(400).json({success: false, msg: error['errmsg']});
      }
    } else {
      return responseByErrorStr(status, message, res);
    }
  }
};

const responseByErrorStr = (errorStr, msg, res) => {
    const response = (code, resObj) => res.status(code).json(resObj);

    const errorsResponses = {
        [ERRORS.BAD_REQUEST]:   {success: false, msg},
        [ERRORS.FORBIDDEN]:     {success: false, msg},
        [ERRORS.NOT_FOUND]:     {success: false, msg},
        [ERRORS.NO_CONTENT]:    {success: false, msg},
        [ERRORS.UNAUTHORIZED]:  {success: false, msg},
        [ERRORS.TOKEN_EXPIRED]: {success: false, expired: true, msg},
        [ERRORS.UNKNOWN_ERROR]: {success: false, expired: true, msg},
        [ERRORS.VALIDATION_FAIL]: {success: false, msg},
        [ERRORS.CONFLICT]:      {success: false, msg},
    };

    const validErrorStr = ERRORS[errorStr] || ERRORS[ERRORS.UNKNOWN_ERROR];
    const statusCode = ERROR_CODES[validErrorStr];
    const responseObj = errorsResponses[validErrorStr];

    response(statusCode, responseObj);
}

const catchErrors = (fn) => {
    return function (req, res, next) {
        return fn(req, res, next).catch(next);
    };
};

const noAvatar = (err, req, res, next) => {
    if (err.path && err.path.includes('images\\pp')) {
        return res.sendFile(appRoot + '/server/public/images/avatar-placeholder.png');
    }
    next(err);
};

const notFound = (req, res) => {
    res.status(404).json({success: false, msg: 'NOT_FOUND'});
};

module.exports = {
    ServerError,
    catchRouterErrors,
    catchErrors,
    notFound,
    noAvatar
}

