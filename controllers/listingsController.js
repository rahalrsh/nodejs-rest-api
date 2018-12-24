module.exports = {
	list(req, res, next) {
	    res.status(200).json({
	  		message: 'listingId'
	  	});
	},

	getByListingId(req, res, next) {
		const listingId = req.params.listingId;
		res.status(200).json({
	  		message: 'listingId='+listingId
	  	});
	},

	addListing(req, res, next) {
		const listing = {
			name: req.body.name,
			description: req.body.description
		}
		res.status(200).json({
	  		message: 'listing created',
	  		listing: listing
	  	});
	}
};

// update
// delete