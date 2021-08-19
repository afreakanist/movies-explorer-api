const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/user');
const NotFoundError = require('../errors/NotFoundError');
const { resourceNotFoundMsg } = require('../utils/errorMessages');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), createUser);

router.use('/users', auth, require('./user'));
router.use('/movies', auth, require('./movie'));

router.all('*', (req, res, next) => next(new NotFoundError(resourceNotFoundMsg)));

module.exports = router;
