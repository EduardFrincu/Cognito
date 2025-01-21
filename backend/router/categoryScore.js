const router = require('express').Router();
const {insertCategoryScore, getCategoriesEvolutions} = require('../controllers/categoryScoreController');
const { verifyToken } = require('../controllers/verifyTokenController');

router.post('/insertDailyCategoryScore', [verifyToken], insertCategoryScore);
router.get('/categoriesEvolutions', [verifyToken], getCategoriesEvolutions);

module.exports = router;