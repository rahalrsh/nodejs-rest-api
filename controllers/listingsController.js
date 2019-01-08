const listingModel = require('../models').Listing;
const likesModel = require('../models').Likes;
const listingLikeIntermediateModel = require('../models').ListingLikeIntermediate;
const likesConsts = require('../conts/likes');
const async = require('async');
const Sequelize = require('sequelize');

module.exports = {
	list(req, res, next) {
		return listingModel
			.findAll({})
			.then((listings) => res.status(200).json({
				message: "all listing",
				listings: listings
			}))
      		.catch((error) => next(error));
	},

	getByListingId(req, res, next) {
		const listingId = req.params.listingId;

		return listingModel
			.findById(listingId,{})
			.then((listing) => {
				if(!listing){
					return res.status(200).send({
			            message: 'listing '+ listingId +' not found'
			        });
				}
				return res.status(200).send({
					message: 'listing '+ listingId +' found',
					listing: listing
				});
			})
      		.catch((error) => next(error));
	},

	addListing(req, res, next) {
		const newListing = {
			name: req.body.name,
			description: req.body.description
		}

		return listingModel
			.create(newListing)
			.then((listing) => res.status(200).json({
				message: 'listing created!',
				listing: listing
			}))
			.catch((error) => next(error));
	},

	// listings/:listingId/like
	likeListing(req, res, next){
		let rsp = {};
		rsp.reqListingId = req.params.listingId;
		rsp.reqUserId = req.userData.userId;

	    const tasks = [
	    	function checkIfAlreadyLiked(callback){
	    		var alreadyLiked = false;
	    		return callback(null, alreadyLiked);
	    	},
			function incrementListingLikeCount(callback){
				return listingModel
				  .update({ likesCount: Sequelize.literal('"likesCount" + 1') }, { where: { id: rsp.reqListingId }})
				  .then((listing) => {
				    rsp.listing = listing;
				    return callback(null, listing);
				  })
				  .catch((error) => {
				  	callback(error)
				  });
			},
			function createLike(callback){
				const newLike = {
				  UserId : rsp.reqUserId,
				  type: likesConsts.Like,
				}
				console.log(newLike);
				return likesModel
		          .create(newLike)
		          .then((like) => {
		            rsp.like = like;
		            return callback(null, like);
		          })
		          .catch((error) => {
				  	callback(error)
				  });
			},
			function createListingLikeIntermediate(callback){
				const newListingLikeIntermediate = {
					ListingId: rsp.reqListingId,
				 	LikeId : rsp.like.id
				}
				return listingLikeIntermediateModel
				  .create(newListingLikeIntermediate)
				  .then((listingLikeIntermediate) => {
				    return callback(null, listingLikeIntermediate);
				  })
				  .catch((error) => {
				  	console.log('Error 3');
				  	callback(error)
				  });
			}
	    ];
	    async.series(tasks, (err, results) => {
	        if (err) {
	            return next(err);
	        }
	        // const newListing = results[0];
	        return res.status(200).json(results);
	    })

	}
};

// update
// delete