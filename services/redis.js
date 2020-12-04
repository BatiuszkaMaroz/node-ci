// const redis = require('redis');
// const promisify = require('util').promisify;

// class RedisController {
//   client;

//   constructor(url = 'redis://localhost:6379') {
//     this.client = redis.createClient(url);
//   }

//   async get(key) {
//     const { client } = this;
//     const result = await promisify(client.get.bind(client))(key);

//     return JSON.parse(result);
//   }

//   async hget(key, field) {
//     const { client } = this;
//     const result = await promisify(client.hget.bind(client))(key, field);

//     return JSON.parse(result);
//   }

//   async set(key, data) {
//     const { client } = this;
//     await promisify(client.set.bind(client))(
//       key,
//       JSON.stringify(data),
//       'EX',
//       10,
//     );
//   }

//   async hset(key, field, data) {
//     const { client } = this;
//     await promisify(client.hset.bind(client))(key, field, JSON.stringify(data));
//   }

//   async del(key) {
//     const { client } = this;
//     await promisify(client.del.bind(client))(JSON.stringify(key));
//   }

//   async flushAll() {
//     const { client } = this;
//     await promisify(client.flushall.bind(client))();
//   }
// }

// exports.redisController = new RedisController();
