require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { celebrate, Joi, errors } = require('celebrate');

const auth = require('./middlewares/auth');
const cors = require('./middlewares/cors');
const errorHandler = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { createUser, login } = require('./controllers/user');

const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3001 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors);
app.use(requestLogger);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), createUser);

app.use('/users', auth, require('./routes/user'));
app.use('/movies', auth, require('./routes/movie'));

app.all('*', (req, res, next) => next(new NotFoundError('Запрашиваемый ресурс не найден')));

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
