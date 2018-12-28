const userModel = require('../models').User;
const accountModel = require('../models').Account;
const listingModel = require('../models').Listing;
const userAccountIntermediateModel = require('../models').UserAccountIntermediate;
const accountListingIntermediateModel = require('../models').AccountListingIntermediate;
const async = require('async');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
	list(req, res, next) {
      return userModel
      .findAll({})
      .then((users) => res.status(200).json({
        message: "all users",
        users: users
      }))
      .catch((error) => next(error));
  },

  getByUserId(req, res, next) {
    const userId = req.params.userId;

    return userModel
      .findById(userId,{})
      .then((user) => {
        if(!user){
          return res.status(200).send({
                  message: 'user '+ userId +' not found'
              });
        }
        return res.status(200).send({
          message: 'user '+ userId +' found',
          user: user
        });
      })
      .catch((error) => next(error));
  },

  getListingByUserIdandAccountIdandListingId(req, res, next){
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

  // POST '/:userId/accounts/:accountId/listings'
  postListingByUserIdandAccountId(req, res, next){
    let rsp = {};
    rsp.reqAccountId = req.params.accountId;
    // const userId = req.params.userId;
    // const accountId = req.params.accountId;

    const tasks = [
      function createListing(callback){
        const newListing = {
          name: req.body.name,
          description: req.body.description
        }
        return listingModel
          .create(newListing)
          .then((listing) => {
            rsp.listing = listing;
            return callback(null, listing);
          })
          .catch((error) => callback(error));
      },
      function createAccountListingIntermediate(callback){
        const newAccountListingIntermediate = {
          AccountId : rsp.reqAccountId,
          ListingId: rsp.listing.id,
        }
        return accountListingIntermediateModel
          .create(newAccountListingIntermediate)
          .then((accountListingIntermediate) => {
            rsp.accountListingIntermediate = accountListingIntermediate;
            return callback(null, accountListingIntermediate);
          })
          .catch((error) => callback(error));
      }
    ];
    async.series(tasks, (err, results) => {
        if (err) {
            return next(err);
        }
        // const newListing = results[0];
        return res.status(200).json(results);
    })
  },

  // GET 'users/:userId/accounts/:accountId/listings'
  getListingByUserIdandAccountId(req, res, next){
    const userId = req.params.userId;
    const accountId = req.params.accountId;

    return accountListingIntermediateModel
      .findAll({
        where: {AccountId: accountId},
        include: [listingModel]
      })
      .then((accountListingIntermediates) => {
        if(!accountListingIntermediates){
          return  res.status(200).json({
            message: {
              error: 'No listings found'
            }
          })
        }

        let listings = [];
        for(accountListingIntermediate of accountListingIntermediates){
          let listing = accountListingIntermediate.Listing;
          listings.push(listing);
        }

        return  res.status(200).json({
          message: "all listings",
          listings: listings
        })
      })
      .catch((error) => next(error));
  },

  // GET users/:userId/accounts/:accountId
  getAccountByUserIdandAccountId(req, res, next){
    const userId = req.params.userId;
    const accountId = req.params.accountId;

    return accountModel
      /*.findById(accountId,{
        include : [userAccountIntermediateModel]
      })*/
      .findById(accountId)
      .then((account) => {
        if(!account){
          return res.status(200).send({
            message: 'No account with id '+ accountId
          });
        }

        /*let userAccountIntermediates = account.UserAccountIntermediates; //Account.hasMany(models.UserAccountIntermediate);
        let allowed = false;
        for(userAccountIntermediate of userAccountIntermediates){
          allowed = allowed || (userId == userAccountIntermediate.UserId);
        }

        if(allowed == false){
          return res.status(200).send({
            message: 'Not allowed to access account ' + accountId
          });
        }*/

        return res.status(200).send({
          message: 'Account found',
          account: account
        });
      })
      .catch((error) => next(error));
  },

  // users/:userId/accounts
  getAccountsByUserId(req, res, next) {
    const userId = req.params.userId;

    // user.userAccountIntermediate.account
    return userModel
      .findById(userId,{
        include: [
          {
            model: userAccountIntermediateModel,
            include: [accountModel]
          }
        ]
      })
      .then((user) => {
        if(!user){
          return res.status(200).send({
                  error: {
                    message: 'user '+ userId +' not found'
                  }
              });
        }
        const userAccountIntermediates = user.UserAccountIntermediates; // User.hasMany(models.UserAccountIntermediate);
        let accounts = [];

        if(!userAccountIntermediates || userAccountIntermediates.length==0){
          return res.status(200).send({
                  error: {
                    message: 'Thre are no accounts for user '+ userId
                  }
              });
        }

        for(userAccountIntermediate of userAccountIntermediates){
          let account = userAccountIntermediate.Account;
          accounts.push(account);
        }

        if(accounts.length==0){
          return res.status(200).send({
                  error: {
                    message: 'Accounts for user '+ userId +' not found'
                  }
              });
        }

        return res.status(200).send({
          message: 'All accounts for user ' + userId,
          accounts: accounts
        });
      })
      .catch((error) => next(error));

  },

  loginUser(req, res, next){
    let rsp = {};

    const tasks = [
      function checkEmailExists(callback){
        return userModel
        .findOne({where: {email: req.body.email}})
        .then((user) => {
          if(user){
            rsp.user = user;
            return callback(null, user);
          }
          else{
            res.status(401).json({
                message: "Auth Failed"
            })
          }
        })
        .catch((error) => next(error));
      },
      function comparePassword(callback){
        const user = rsp.user;
        bcrypt.compare(req.body.password, user.password, (error, result) => {
          if(error){
            res.status(401).json({
              message: "Auth Failed"
            })
          }
          if(result==false){
            res.status(401).json({
              message: "Auth Failed"
            })
          }
          if(result==true){
            return callback(null, result);
          }

        })
      }
    ];
    async.series(tasks, (err, results) => {
        if (err) {
            return next(err);
        }
        const loggedInUser = results[0];
        const hashMatched = results[1];

        // Generate JWT token
        const token = jwt.sign({
            userId: rsp.user.id,
            email: rsp.user.email
          }, 
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "1h"
          }
        );
        console.log(process.env.JWT_KEY);
        // We set a custom header named 'x-auth-token'
        // from UI read this token and send with header x-auth-token 
        // in all subsequent requests
        return res.status(200).header('x-auth-token', token).json({
          message: "User Logged In"
        });
    })
  },

  signupUser(req, res, next){
    let rsp = {};

    // TO-DO: NULL Checks ex: check username, password, email null and valid
    // TO-DO: email validation

    const tasks = [
      function checkDuplicateEmail(callback){
        return userModel
          .findOne({where: {email: req.body.email}})
          .then((user) => {
            if(user){
              res.status(200).json({
                error: {
                  message: "User with this email already exists"
                }
              })
            }
            else{
              return callback(null);
            }
          })
          .catch((error) => next(error));
      },
      function hashPassword(callback){
        bcrypt.hash(req.body.password, 10, (error, hash) => {
          if(error){
            return callback(error);
          }
          else{
            rsp.hash = hash;
            return callback(null, hash);
          }
        });
      },
      function createUser(callback){
        console.log("createUser");
        const newUser = {
          username: req.body.username,
          email: req.body.email,
          password: rsp.hash
        }

        return userModel
          .create(newUser)
          .then((user) => {
            rsp.user = user;
            console.log("success 2");
            return callback(null, user);
          })
          .catch((error) => callback(error));
      },
      function createAccount(callback){
        console.log("createAccount");
        const newAccount = {}
        return accountModel
          .create(newAccount)
          .then((account) => {
            rsp.account = account;
            return callback(null, account);
          })
          .catch((error) => callback(error));
      },
      function createUserAccountIntermediate(callback){
        console.log("createUserAccountIntermediate");
        const newUserAccountIntermediate = {
          UserId: rsp.user.id,
          AccountId : rsp.account.id
        }
        return userAccountIntermediateModel
          .create(newUserAccountIntermediate)
          .then((userAccountIntermediate) => {
            rsp.userAccountIntermediate = userAccountIntermediate;
            return callback(null, userAccountIntermediate);
          })
          .catch((error) => callback(error));
      }
    ];
    async.series(tasks, (err, results) => {
        if (err) {
            return next(err);
        }
        const existingUser = results[0];
        const hash = results[1];
        const user = results[2];
        const account = results[3];
        const userAccountIntermediate = results[4];
        return res.status(200).json(results);
    })
  }
};