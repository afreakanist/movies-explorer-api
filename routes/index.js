const router = require('express').Router();
const auth = require('../middlewares/auth');
const { validateSignIn, validateSignUp } = require('../middlewares/validate');
const { createUser, login } = require('../controllers/user');
const NotFoundError = require('../errors/NotFoundError');
const { resourceNotFoundMsg } = require('../utils/errorMessages');

router.post('/signin', validateSignIn, login);
router.post('/signup', validateSignUp, createUser);

router.use('/users', auth, require('./user'));
router.use('/movies', auth, require('./movie'));

router.all('*', (req, res, next) => next(new NotFoundError(resourceNotFoundMsg)));

module.exports = router;
