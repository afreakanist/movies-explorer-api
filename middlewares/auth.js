const jwt = require('jsonwebtoken');
const { userUnauthorizedMsg } = require('../utils/errorMessages');

const { NODE_ENV, JWT_SECRET } = process.env;
const { DEV_JWT_SECRET } = require('../utils/config');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: userUnauthorizedMsg });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : DEV_JWT_SECRET);
  } catch (err) {
    return res.status(401).send({ message: userUnauthorizedMsg });
  }

  req.user = payload;

  return next();
};
