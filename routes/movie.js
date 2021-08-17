const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const ValidationError = require('../errors/ValidationError');

const { getMovies, postMovie, deleteMovie } = require('../controllers/movie');

const checkURL = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new ValidationError('Некорректная ссылка');
};

router.get('/', getMovies);
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    image: Joi.string().required().custom(checkURL),
    trailer: Joi.string().required().custom(checkURL),
    thumbnail: Joi.string().required().custom(checkURL),
  }),
}), postMovie);
router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex(),
  }),
}), deleteMovie);

module.exports = router;
