const Movie = require('../models/movie');
const CastError = require('../errors/CastError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

module.exports.postMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    owner: { _id: req.user._id },
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Данные не прошли валидацию'));
      } else {
        next();
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;

  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        next(new NotFoundError('Карточка не найдена'));
      }
      if (movie.owner._id.toString() !== req.user._id) {
        next(new ForbiddenError('Удалять можно только свои карточки с фильмами'));
      } else {
        Movie.deleteOne({ _id: movieId })
          .then((m) => res.status(200).send({ message: `Карточка фильма ${movie.nameEN} (${movieId}) была удалена`, ...m }))
          .catch((err) => {
            if (err.name === 'CastError') {
              next(new CastError('Неправильный запрос'));
            } else {
              next();
            }
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Неправильный запрос'));
      } else {
        next();
      }
    });
};
