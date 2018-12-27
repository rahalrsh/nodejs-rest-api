'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserAccountIntermediate = sequelize.define('UserAccountIntermediate', {
    // userId: DataTypes.INTEGER,
    // accountId: DataTypes.INTEGER
  }, {});
  UserAccountIntermediate.associate = function(models) {
    // associations can be defined here
    UserAccountIntermediate.belongsTo(models.User, {foreignKey: 'UserId'});
    UserAccountIntermediate.belongsTo(models.Account, {foreignKey: 'AccountId'});
  };
  return UserAccountIntermediate;
};