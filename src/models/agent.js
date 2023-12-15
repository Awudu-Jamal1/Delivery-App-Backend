'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Agent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Agent.belongsTo(models.User,{
        foreignKey:'user_id'
      })
      Agent.hasMany(models.Order,{
        foreignKey:'agent_id'
      })
      Agent.hasMany(models.FeeSplit,{
        foreignKey:'agent_id'
      })
      Agent.hasMany(models.Trip,{
        foreignKey:'agent_id'
      })
    }
  }
  Agent.init({
    vehicle_number: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Agent',
  });
  return Agent;
};