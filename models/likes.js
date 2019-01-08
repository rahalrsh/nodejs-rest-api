'use strict';
module.exports = (sequelize, DataTypes) => {
  const Likes = sequelize.define('Likes', {
    UserId: DataTypes.INTEGER,
    type: DataTypes.STRING
  }, {});
  Likes.associate = function(models) {
    // associations can be defined here
    Likes.hasOne(models.ListingLikeIntermediate);
  };
  return Likes;
};