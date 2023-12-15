'use strict';
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
      User.hasMany(models.Merchant,{
        foreignKey:"user_id"
      })
      User.hasMany(models.Customer,{
        foreignKey:"user_id"
      })
      User.hasMany(models.Agent,{
        foreignKey:"user_id"
      })
      User.hasOne(models.Wallet,{
        foreignKey:"user_id"
      })

    }
  }
  User.init({
    firstName: DataTypes.STRING,
    lastName:DataTypes.STRING,
    role: DataTypes.STRING,
    email: {type: DataTypes.STRING,unique:true},
    password: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};