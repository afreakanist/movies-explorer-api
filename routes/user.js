const router = require('express').Router();

const { validateUpdateProfile } = require('../middlewares/validate');
const { getMyUserInfo, updateProfile } = require('../controllers/user');

router.get('/me', getMyUserInfo);
router.patch('/me', validateUpdateProfile, updateProfile);

module.exports = router;
