const router = require('express').Router();

const login = require('../controllers/authController').login;
const register = require('../controllers/authController').register;

router.post('/login', [], login);
router.post('/register', [], register);

module.exports = router;