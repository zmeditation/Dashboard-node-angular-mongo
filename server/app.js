const express = require('express');
const path = require('path');
global.appRoot = path.resolve(__dirname);
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
/**
 * @deprecated
 */
const bodyParser = require('body-parser');

const expressValidator = require('express-validator');
const passport = require('passport');
const helmet = require('helmet');
const app = express();
const { catchRouterErrors, notFound, noAvatar } = require('./server/handlers/errorHandlers');

app.use(logger('dev'));
app.use(helmet());
app.use(express.json({ limit: '50mb', extended: true }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(expressValidator());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist/')));

app.use(passport.initialize({}));
app.use(passport.session({}));

require('./server/handlers/passport')(passport);

app.all('*', function (req, res, next) {
  const whitelist = [
    'http://45.63.41.142:4200', //Docker 12123
    'http://localhost:4200',
    'http://192.168.112.105:4200',
    'https://localhost:4200',
    'http://192.168.88.33:4200',
    'http://192.168.0.100:4200',
    'https://dashboard.wmgroup.us',
    'https://dev.dashboard.wmgroup.us',
    'https://staging.dashboard.wmgroup.us',
    'http://staging.dashboard.wmgroup.us'
  ];
  const origin = req.headers.origin;

  if (!origin) {
    next();
  } else {
    const responseSettings = {
      AccessControlAllowHeaders:
        'Content-Type, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name',
      AccessControlAllowMethods: 'POST, GET, PUT, DELETE, OPTIONS',
      AccessControlAllowCredentials: true
    };

    res.header('Access-Control-Allow-Credentials', responseSettings.AccessControlAllowCredentials);

    whitelist.forEach((val) => {
      if (origin && origin.indexOf(val) > -1) {
        res.header('Access-Control-Allow-Origin', origin);
      }
    });

    res.header(
      'Access-Control-Allow-Headers',
      req.headers['access-control-request-headers'] ? req.headers['access-control-request-headers'] : 'x-requested-with'
    );
    res.header(
      'Access-Control-Allow-Methods',
      req.headers['access-control-request-method']
        ? req.headers['access-control-request-method']
        : responseSettings.AccessControlAllowMethods
    );
    res.header('Server', '');

    if ('OPTIONS' === req.method) {
      res.sendStatus(200);
    } else {
      next();
    }
  }
});

const appRoutes = require('./server/routes/api');
const utilityRoutes = require('./server/routes/adServerRoutes');
const { getNext } = require('./server/handlers/getNext');

app.use(getNext);

app.use('/api', appRoutes);
app.use('/utilities', utilityRoutes);
app.use(
  '/public',
  express.static(__dirname + '/server/public', {
    maxAge: 2592000,
    fallthrough: false,
    setHeaders: function (res, path) {
      if (path.includes('/images/') || path.includes('thumbnail')) {
        res.setHeader('Expires', new Date(Date.now() + 2592000000).toUTCString());
      }
    }
  })
);

app.use(noAvatar);
app.use(notFound);
app.use(catchRouterErrors);

module.exports = app;
