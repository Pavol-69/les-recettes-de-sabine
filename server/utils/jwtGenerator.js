const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(user_id, time) {
  const payload = {
    user: user_id,
  };

  return jwt.sign(payload, process.env.jwtSecret, { expiresIn: `${time}` });
}

module.exports = jwtGenerator;
