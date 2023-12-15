'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FeeSplit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FeeSplit.belongsTo(models.Fee,{
        foreignKey:'fee_id'
      })
      FeeSplit.belongsTo(models.Agent,{
        foreignKey:'agent_id'
      })
      FeeSplit.belongsTo(models.Merchant,{
        foreignKey:'merchant_id'
      })
    }
  }
  FeeSplit.init({
    merchant_amt: DataTypes.INTEGER,
    agent_amt: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'FeeSplit',
  });
  return FeeSplit;
};