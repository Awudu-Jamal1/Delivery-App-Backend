'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Merchant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Merchant.belongsTo(models.User,{
        foreignKey:'user_id'
      })
      Merchant.hasMany(models.Order,{
        foreignKey:'merchant_id'
      })
      Merchant.hasMany(models.Fee,{
        foreignKey:'merchant_id'
      })
      Merchant.hasMany(models.FeeSplit,{
        foreignKey:'merchant_id'
      })
    }
  }
  Merchant.init({
    business_name: DataTypes.STRING,
    business_address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Merchant',
  });
  return Merchant;
};