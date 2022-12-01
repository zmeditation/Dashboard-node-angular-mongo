const mongoose = require('mongoose');

const mongoDBOptions = () => {
  return {
    useNewUrlParser: true,
    autoIndex: false,
    poolSize: 10,
    promiseLibrary: global.Promise,
    keepAlive: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 500000,
    dbName: process.env.DATABASE_NAME
  };
}

const mongoDBListeners = async (params) => { 

  mongoose.connection.on('connected', () => {
    console.log('Database Connection: Success');
  });
  mongoose.connection.on('close', () => {
    console.log('Database Connection: Closed');
  });
  mongoose.connection.on('error', (err) => {
    console.log(`Database error ${err}`);
  });
  mongoose.connection.on('open', () => {
    console.log(`Database Connection: Opened`);
  });
  
  await mongoose.connection.close();
  await mongoose.connect(params, mongoDBOptions());
  mongoose.set('useFindAndModify', false);
}

const mongoDBClose = () => {
  mongoose.connection.close();
}

module.exports = {
  mongoDBListeners,
  mongoDBClose,
  mongoDBOptions
}