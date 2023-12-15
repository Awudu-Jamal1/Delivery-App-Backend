'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Customer.belongsTo(models.User,{
        foreignKey:'user_id'
      })
      Customer.hasMany(models.Order,{
        foreignKey:'customer_id'
      })
    }
  }
  Customer.init({

  }, {
    sequelize,
    modelName: 'Customer',
  });
  return Customer;
};