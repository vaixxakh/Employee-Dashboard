const mongoose = require('mongoose');
const dns = require('dns');

const PUBLIC_DNS_SERVERS = ['8.8.8.8', '1.1.1.1'];

const isDnsResolutionError = (error) =>
  typeof error?.message === 'string' &&
  /querySrv|resolveSrv|resolveTxt|ECONNREFUSED|ETIMEDOUT|ETIMEOUT|ESERVFAIL/.test(
    error.message
  );

const applyPublicDnsFallback = () => {
  dns.setServers(PUBLIC_DNS_SERVERS);
  dns.promises.setServers(PUBLIC_DNS_SERVERS);
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODBURI);

    console.log('MongoDB connected successfully.')
  } catch (error) {
    if (!isDnsResolutionError(error)) {
      console.error('MongoDB connection failed!:', error.message);
      process.exit(1);
    }

    console.warn(
      'DNS resolution failed via system resolvers, retrying with public DNS...'
    );
    applyPublicDnsFallback();

    try {
      await mongoose.connect(process.env.MONGODBURI);

      console.log('MongoDB connected successfully.');
    } catch (retryError) {
      console.error('MongoDB connection failed!:', retryError.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
