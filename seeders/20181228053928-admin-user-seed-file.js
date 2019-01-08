// sequelize seed:create --name my-seed-file
// sequelize db:seed:all
'use strict';

const roles = require('../conts/roles');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      username : 'admin',
      email : 'admin@admin.com',
      password : '$2b$10$dJJXr3JVA7wPKY.g1jEH7ug0l3nYDfvbXjyCIko8GvQ3RjbXLiOIy', // this is 'password'
      role : roles.Admin,
      createdAt : new Date(),
      updatedAt : new Date()
    }], {});

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
