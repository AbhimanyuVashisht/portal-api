'use strict';

let mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/portal', function (error) {
    if(error) {
        console.log(error);
    }
    console.log('Connected to Mongodb portal Database');
});

let MORGAN_LOG_PATH = './app/logs';

module.exports = {
    MORGAN_LOG_PATH: MORGAN_LOG_PATH
};
