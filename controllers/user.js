const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { DEV_JWT_SECRET } = require('../utils/config');
const CastError = require('../errors/CastError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ValidationError = require('../errors/ValidationError');
const {
  userNotFoundMsg, userExistsConflictMsg, userUnauthorizedMsg, validationErrMsg, castErrMsg,
} = require('../utils/errorMessages');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getMyUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.status(200).send({ name: user.name, email: user.email });
      }
      return next(new NotFoundError(userNotFoundMsg));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError(castErrMsg));
      } else {
        next();
      }
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(() => next(new NotFoundError(userNotFoundMsg)))
    .then((user) => res.status(200).send({ name: user.name, email: user.email }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(validationErrMsg));
      } if (err.name === 'CastError') {
        next(new CastError(castErrMsg));
      } else {
        next();
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  User.findOne({ email }).then((u) => {
    if (u) {
      throw new ConflictError(userExistsConflictMsg);
    }
    bcrypt.hash(password, 10)
      .then((hash) => User.create({
        name, email, password: hash,
      }))
      .then((user) => res.status(201).send({ _id: user._id, email: user.email }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new ValidationError(validationErrMsg));
        } else {
          next();
        }
      });
  }).catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError(userUnauthorizedMsg);
      }

      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : DEV_JWT_SECRET, { expiresIn: '7d' });

      res.send({ token });

      /* res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      }).end(); */
    })
    .catch(next);
};
