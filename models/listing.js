'use strict';
module.exports = (sequelize, DataTypes) => {
  const Listing = sequelize.define('Listing', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    likesCount: DataTypes.INTEGER
  }, {});
  Listing.associate = function(models) {
    // associations can be defined here
    Listing.hasMany(models.UserListingIntermediate);
  };
  return Listing;
};