'use strict';
const {
  Model
} = require('sequelize');
const customer = require('./customer');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.Customer,{
        foreignKey:'customer_id'
      })
      Order.belongsTo(models.Merchant,{
        foreignKey:'merchant_id'
      })
      Order.belongsTo(models.Agent,{
        foreignKey:'agent_id'
      })
      Order.hasMany(models.Order_Item,{
        foreignKey:'order_id'
      })
      Order.hasMany(models.Fee,{
        foreignKey:'order_id'
      })
    }
  }
  Order.init({
    transaction_id: DataTypes.STRING,
    total_price: DataTypes.INTEGER,
    reciever_name: DataTypes.STRING,
    reciever_no: DataTypes.STRING,
    status: DataTypes.STRING,
    order_location: DataTypes.STRING,
    delivery_location: DataTypes.STRING,
    type: DataTypes.STRING,
    weight: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};