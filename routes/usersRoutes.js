var express = require('express');
var router = express.Router();
const usersController = require('../controllers/usersController');

/*
	GET /api/users/
	POST /api/users/signup
*/

/* GET users list. */
router.get('/', usersController.list);
router.get('/:userId', usersController.getByUserId);
router.get('/:userId/accounts', usersController.getAccountsByUserId);
router.get('/:userId/accounts/:accountId', usersController.getAccountByUserIdandAccountId);
router.post('/:userId/accounts/:accountId/listings', usersController.postListingByUserIdandAccountId);
router.get('/:userId/accounts/:accountId/listings', usersController.getListingByUserIdandAccountId);
router.post('/signup', usersController.signupUser);
router.post('/login', usersController.loginUser);

module.exports = router;
