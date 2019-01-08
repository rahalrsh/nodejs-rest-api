const jwt = require('jsonwebtoken');
const userModel = require('../models').User;
const userAccountIntermediateModel = require('../models').UserAccountIntermediate;
const userListingIntermediateModel = require('../models').UserListingIntermediate;

module.exports = {
	authenticated(req, res, next) {
		try{
			const decode = jwt.verify(req.header('x-auth-token'), process.env.JWT_SECRET_KEY);
			req.userData = decode;
		}catch(error){
			return res.status(401).json({
				error: {
					message: "Auth Failed: Not Authenticated"
				}
			});
		}
		next();
  	},

  	// is the currently authenticated user authorized to access the user (by id=userId)
  	userAuthorized(req, res, next){
  		if(req.userData.userId != req.params.userId){
  			return res.status(401).json({
				error: {
					message: "Auth Failed: Not Authorized to access User"
				}
			});
  		}
  		next();
  	},

  	// is the user authorized to access the account
  	accountAuthorized(req, res, next){
  		return userAccountIntermediateModel
  		.findOne({where: {UserId: req.userData.userId, AccountId: req.params.accountId}})
  		.then((userAccountIntermediate) => {
  			if(!userAccountIntermediate){
  				return res.status(401).json({
					error: {
						message: "Auth Failed: Not Authorized to access Account"
					}
				});	
  			}
  			next();
  		})
  		.catch((error) => {
  			return res.status(401).json({
				error: {
					message: "Auth Failed: Not Authorized to access Account"
				}
			});	
  		});
  	},

  	// is the user authorized to access the listing
  	listingAuthorized(req, res, next){
  		return userListingIntermediateModel
  		.findOne({where: {UserId: req.userData.userId, ListingId: req.params.listingId}})
  		.then((userListingIntermediate) => {
  			if(!userListingIntermediate){
  				return res.status(401).json({
					error: {
						message: "Auth Failed: Not Authorized to access listing!"
					}
				});	
  			}
  			next();
  		})
  		.catch((error) => {
  			return res.status(401).json({
				error: {
					message: "Auth Failed: Not Authorized to access listing!!"
				}
			});	
  		});
  	}
};