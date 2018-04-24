'use strict';

let userModel = require('../schema/user.model');

let getUserById = function (userId, cb) {
    userModel.find({ _id: userId }, (err, result) => {
        if(err){
            return cb(err);
        }

        if(!result || result.length === 0){
            return cb(null, null);
        }

        return cb(null, result);
    })
};

module.exports = {
  getUserById: getUserById
};