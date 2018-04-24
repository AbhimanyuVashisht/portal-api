'use strict';

let _ = require('lodash');
let defaults = require('./environments/defaults');
let envConfig = require('./environments/development');

module.exports = _.merge({}, defaults, envConfig);