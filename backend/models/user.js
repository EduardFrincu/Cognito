'use strict'
const bcrypt = require('bcrypt');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Score);
      models.Score.belongsTo(User);
    }
  }
  User.init({
    firstName : DataTypes.STRING,
    lastName : DataTypes.STRING,
    email : DataTypes.STRING,
    gender : DataTypes.STRING,
    password : DataTypes.STRING,
    age : DataTypes.INTEGER,
    phoneNumber : DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
    hooks:{
        beforeCreate: hashPassword,
        beforeUpdate: hashPassword,
    }
  });
  return User;
};

const hashPassword = async (user) =>{
    if(user.changed('password')){
        user.password = await bcrypt.hash(user.password,10);
    }
    return user;
}