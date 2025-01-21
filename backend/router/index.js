const router = require('express').Router();

const auth = require('./auth');
const score = require('./score');
const game = require('./game');
const categoryScore = require('./categoryScore');
const verifyToken = require('../controllers/verifyTokenController').verifyToken;

router.get('/', verifyToken, (req,res) =>{
    return res.send(req.user);
})

router.use(game);
router.use(auth);
router.use(score);
router.use(categoryScore);

module.exports = router;
