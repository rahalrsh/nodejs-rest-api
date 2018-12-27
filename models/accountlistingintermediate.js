'use strict';
module.exports = (sequelize, DataTypes) => {
  const AccountListingIntermediate = sequelize.define('AccountListingIntermediate', {
    AccountId: DataTypes.INTEGER,
    ListingId: DataTypes.INTEGER
  }, {});
  AccountListingIntermediate.associate = function(models) {
    // associations can be defined here
    AccountListingIntermediate.belongsTo(models.Listing, {foreignKey: 'ListingId'});
    AccountListingIntermediate.belongsTo(models.Account, {foreignKey: 'AccountId'});
  };
  return AccountListingIntermediate;
};