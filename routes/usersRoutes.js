var express = require('express');
var router = express.Router();
const usersController = require('../controllers/usersController');
const auth = require('../middleware/check-auth');


router.post('/signup', usersController.signupUser);
router.get('/:userId', auth.authenticated, auth.userAuthorized, usersController.getByUserId);
// router.get('/', usersController.list);
router.post('/login', usersController.loginUser);

// router.post(''/:userId/accounts/') // Not Supported for now
router.get('/:userId/accounts/:accountId', auth.authenticated, auth.userAuthorized, auth.accountAuthorized, usersController.getAccountByUserIdandAccountId);
router.get('/:userId/accounts', auth.authenticated, auth.userAuthorized, usersController.getAccountsByUserId);

router.post('/:userId/listings', auth.authenticated, auth.userAuthorized, usersController.postListingByUserId);
router.get('/:userId/listings/:listingId', auth.authenticated, auth.userAuthorized, auth.listingAuthorized, usersController.getListingByUserIdandListingId);
router.get('/:userId/listings', auth.authenticated, auth.userAuthorized, usersController.getListingsByUserId);

module.exports = router;
