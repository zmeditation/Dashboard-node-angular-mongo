const prepare = require('mocha-prepare');
const mongoose = require('mongoose');
const mongoUnit = require('mongo-unit');

require('dotenv').config({ path: `${__dirname}/../../.env` });

const mongo_config = {
  options: {
    useNewUrlParser: true,
    autoIndex: false,
    poolSize: 10,
    promiseLibrary: global.Promise,
    keepAlive: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  }
};

const mongoUnitStart = (done) => {
  mongoUnit
    .start()
    .then((testMongoUrl) => {
      process.env.DATABASE_URL = testMongoUrl;
      done();
    })
    .catch((error) => console.error('mongoUnitStart error', error));
};

const prepareMongoUnit = () => prepare(mongoUnitStart);

const connect = async () => {
  await mongoose.connect(process.env.DATABASE_URL, mongo_config.options);
  console.log('fake mongoose connected: ', mongoUnit.getUrl());
};

const setCollections = async (params) => {
  // fakeCollections example { reports: [reportObj] }
  const { fakeCollections } = params;

  // load fake test collections.
  await mongoUnit.load(fakeCollections);
};

const disconnect = async () => {
  await mongoUnit.drop();
  console.log('fake mongoose disconnected .....');
};

module.exports = {
  prepareMongoUnit,
  connect,
  setCollections,
  disconnect
};
