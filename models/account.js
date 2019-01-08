'use strict';
module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define('Account', {
    name: DataTypes.STRING,
    mainImg: DataTypes.STRING,
    secondaryImg: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  Account.associate = function(models) {
    // associations can be defined here
    Account.hasMany(models.UserAccountIntermediate);
    // Account.hasMany(models.AccountListingIntermediate);
  };
  return Account;
};