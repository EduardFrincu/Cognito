'use strict';
const Category = require('./').Category;
const Score = require('./').Score;
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Game extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Game.belongsTo(models.Category);
      models.Category.hasMany(Game);

      Game.hasMany(models.Score);
      models.Score.belongsTo(Game);
    }
  }
  Game.init({
    name: DataTypes.STRING,
    categoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Game',
  });
  return Game;
};