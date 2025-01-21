const router = require('express').Router();

const {insertScore} = require('../controllers/scoreController');
const { verifyToken } = require('../controllers/verifyTokenController');

router.post('/insertScore', [verifyToken], insertScore);

module.exports = router;