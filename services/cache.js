const mongoose = require('mongoose');
// const { redisController } = require('./redis');

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = {}) {
  // "this" references to the Query instance created on
  //  every database find request
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key) || '';

  // functor -> chainable
  return this;
};

/*

mongoose.Query.prototype.exec = async function (...args) {
  const { useCache, hashKey = '' } = this;

  if (!useCache) {
    return exec.call(this, ...args);
  }

  const query = this.getFilter();
  const collectionName = this.mongooseCollection.name;

  const field = JSON.stringify({ query, collectionName });
  const cachedValue = await redisController.hget(hashKey, field);

  if (cachedValue) {
    console.log('FROM CACHE');
    let formattedData;

    if (Array.isArray(cachedValue)) {
      formattedData = cachedValue.map((value) => this.model(value));
    } else {
      formattedData = this.model(cachedValue);
    }

    return formattedData;
  }

  console.log('FROM DB');
  const result = await exec.call(this, ...args);

  if (hashKey) {
    await redisController.hset(hashKey, field, result);
  }
  return result;
};

*/
