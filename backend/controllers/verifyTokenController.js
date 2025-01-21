const jwt = require('jsonwebtoken');
const config = require('../config/app');

exports.verifyToken = (req,res,next) =>{
    const bearerToken = req.headers.authorization;
    const token = bearerToken && bearerToken.split(' ')[1];
    if(token === "undefined") res.status(401).json('You are not authenticated');
    jwt.verify(token,config.appKey, function(err, user){
        if(err){
            return res.status(403).json('Token is not valid');
        }
      req.user = user;
      next()
    })
}
