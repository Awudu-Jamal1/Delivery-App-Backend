'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Fee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Fee.belongsTo(models.Order,{
        foreignKey:'order_id'
      })
      Fee.belongsTo(models.Merchant,{
        foreignKey:'merchant_id'
      })
      Fee.hasMany(models.FeeSplit,{
        foreignKey:'fee_id'
      })
    }
  }
  Fee.init({
    amount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Fee',
  });
  return Fee;
};