// db.js
const knex = require('knex');
const config = require('./knex');

const connect_ps = knex(config.development);

module.exports = connect_ps;
