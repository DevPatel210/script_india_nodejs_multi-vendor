const bcrypt = require("bcrypt");

exports.hashPassword = (plaintextPassword) => {
  return bcrypt
    .hash(plaintextPassword, 10)
    .then((hash) => {
      return hash;
    })
    .catch((err) => {
      console.log(err)
    });
};

exports.comparePassword = (plaintextPassword, hash) => {
  return bcrypt
    .compare(plaintextPassword, hash)
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.log(err);
    });
};