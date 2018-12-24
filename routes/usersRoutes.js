var express = require('express');
var router = express.Router();
const usersController = require('../controllers/usersController');

/*
	GET /api/users/
*/

/* GET users list. */
router.get('/', usersController.list);

module.exports = router;
