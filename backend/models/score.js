'use strict';
const User = require('./').User;
const Game = require('./').Game;
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Score extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Score.belongsTo(models.User);
      models.User.hasMany(Score);

      Score.belongsTo(models.Game);
      models.Game.hasMany(Score);
    }
  }
  Score.init({
    userId: DataTypes.INTEGER, 
    gameId: DataTypes.INTEGER,
    score: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Score',
  });
  return Score;
};