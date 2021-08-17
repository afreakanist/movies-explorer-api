const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getMyUserInfo, updateProfile } = require('../controllers/user');

router.get('/me', getMyUserInfo);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
  }),
}), updateProfile);

module.exports = router;
