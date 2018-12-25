const listingModel = require('../models').Listing;

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
	}
};

// update
// delete