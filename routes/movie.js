const router = require('express').Router();

const { validatePostMovie, validateDeleteMovie } = require('../middlewares/validate');
const { getMovies, postMovie, deleteMovie } = require('../controllers/movie');

router.get('/', getMovies);
router.post('/', validatePostMovie, postMovie);
router.delete('/:movieId', validateDeleteMovie, deleteMovie);

module.exports = router;
