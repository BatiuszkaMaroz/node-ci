// const { redisController } = require('../services/redis');

exports.clearCache = async (req, res, next) => {
  // await redisController.del(req?.user?.id);
  next();
};
