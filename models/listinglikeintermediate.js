'use strict';
module.exports = (sequelize, DataTypes) => {
  const ListingLikeIntermediate = sequelize.define('ListingLikeIntermediate', {
    ListingId: DataTypes.INTEGER,
    LikeId: DataTypes.INTEGER
  }, {});
  ListingLikeIntermediate.associate = function(models) {
    // associations can be defined here
    ListingLikeIntermediate.belongsTo(models.Listing, {foreignKey: 'ListingId'});
    ListingLikeIntermediate.belongsTo(models.Likes, {foreignKey: 'LikeId'});
  };
  return ListingLikeIntermediate;
};