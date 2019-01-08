'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserListingIntermediate = sequelize.define('UserListingIntermediate', {
    UserId: DataTypes.INTEGER,
    ListingId: DataTypes.INTEGER
  }, {});
  UserListingIntermediate.associate = function(models) {
    // associations can be defined here
    UserListingIntermediate.belongsTo(models.Listing, {foreignKey: 'ListingId'});
    UserListingIntermediate.belongsTo(models.User, {foreignKey: 'UserId'});
  };
  return UserListingIntermediate;
};