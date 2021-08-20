const Movie = require('../models/movie');
const CastError = require('../errors/CastError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const {
  movieNotFoundMsg, movieForbiddenMsg, validationErrMsg, castErrMsg,
} = require('../utils/errorMessages');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

module.exports.postMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image,
    trailer, nameRU, nameEN, thumbnail, movieId,
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
    movieId,
    owner: { _id: req.user._id },
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(validationErrMsg));
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
        next(new NotFoundError(movieNotFoundMsg));
      }
      if (movie.owner._id.toString() !== req.user._id) {
        next(new ForbiddenError(movieForbiddenMsg));
      } else {
        Movie.deleteOne({ _id: movieId })
          .then((m) => res.status(200).send({ message: `Карточка фильма ${movie.nameEN} (${movieId}) была удалена`, ...m }))
          .catch((err) => {
            if (err.name === 'CastError') {
              next(new CastError(castErrMsg));
            } else {
              next();
            }
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError(castErrMsg));
      } else {
        next();
      }
    });
};
