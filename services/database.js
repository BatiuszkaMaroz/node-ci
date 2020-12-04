const mongoose = require('mongoose');

exports.dbConnect = async function () {
  let auth = {
    user: 'root',
    password: 'root',
  };

  if (process.env.NODE_ENV === 'ci') {
    auth = {
      user: '',
      password: '',
    };
  }

  await mongoose.connect('mongodb://localhost:27017', {
    auth,
    dbName: 'node_advanced',
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
};
