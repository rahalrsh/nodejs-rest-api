var express = require('express');
var router = express.Router();
const listingsController = require('../controllers/listingsController');

/*
	GET  /api/listings/
	GET  /api/listings/:listingId
	POST /api/listings/
*/

/* GET listings list. */
router.get('/', listingsController.list);
router.get('/:listingId', listingsController.getByListingId);
router.post('/', listingsController.addListing);

module.exports = router;
