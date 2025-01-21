
const User = require('../models').User;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const config = require('../config/app');

exports.login = async(request,response) => {
    const email = request.body.email;
    const password = request.body.password;

    try {
        const user = await User.findOne({
            where: {
                email:email
            }
        });


        if(!user){
            //it means that a user with the provided email is not present in db
            return response.status(404).json({
                message:'User not found'
            })
        }

        if(!bcrypt.compareSync(password, user.password)){
            //provided password is hashed and checked to the one presented in db
            return response.status(401).json({
                message: 'Incorrect password'
            });
        }

        const userWithToken = generateToken(user.get({raw:true}));
        return response.send(userWithToken);        

    } catch (error) {
        return response.status(500).json({message: error.message});
    }
}


exports.register = async(request, response) => {

    try {
        const user = await User.create(request.body);

        const userWithToken = generateToken(user.get({raw:true}));
        return response.send(userWithToken);

    } catch (error) {
        console.log(User)
        return response.status(500).json({message: error.message, data: request.body});
    }

}

const generateToken = (user) => {
    delete user.password;

    const token = jwt.sign(user,config.appKey, {expiresIn: 86400});
    return {...user, token}
}