const knex = require('knex');
const config = require('../knexfile');
const environment = process.env.DB_ENV || 'development';

// compare environments in terminal !!!
console.log('db env is: ', environment);

module.exports = knex(config[environment]);