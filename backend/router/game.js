const router = require('express').Router();
const {fetchCategoriesAndGames, getGameIdByName, get5HighestScores,get5LastGames} = require('../controllers/gameController');
const { verifyToken } = require('../controllers/verifyTokenController');

router.get('/games', [verifyToken], fetchCategoriesAndGames);
router.get('/game/:name', [verifyToken], getGameIdByName);
router.get('/lastGames', [verifyToken], get5LastGames);
router.get('/highestScores', [verifyToken], get5HighestScores);

module.exports = router;