'use strict';

let mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/portal', function (error) {
    if(error) {
        console.log(error);
    }
    console.log('Connected to Mongodb portal Database');
});

