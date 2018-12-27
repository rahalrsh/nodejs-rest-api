'use strict';
module.exports = (sequelize, DataTypes) => {
  const Listing = sequelize.define('Listing', {
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  Listing.associate = function(models) {
    // associations can be defined here
    Listing.hasOne(models.AccountListingIntermediate);
  };
  return Listing;
};