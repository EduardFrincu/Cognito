'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CategoryScores extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CategoryScores.belongsTo(models.User);
      models.User.hasMany(CategoryScores);

      CategoryScores.belongsTo(models.Category);
      models.Category.hasMany(CategoryScores);
    }
  }
  CategoryScores.init({
    userId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
    score: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CategoryScores',
  });
  return CategoryScores;
};