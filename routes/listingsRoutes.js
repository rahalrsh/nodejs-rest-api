var express = require('express');
var router = express.Router();
const listingsController = require('../controllers/listingsController');
const auth = require('../middleware/check-auth');

/*
	GET  /api/listings/
	GET  /api/listings/:listingId
	POST /api/listings/
*/

/* GET listings list. */
router.get('/', listingsController.list);
router.get('/:listingId', listingsController.getByListingId);
router.post('/', listingsController.addListing);

router.put('/:listingId/like', auth.authenticated, listingsController.likeListing);

module.exports = router;
