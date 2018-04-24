'use strict';
let crypto = require('crypto');
let async = require('async');

let status = require('../configs/status');

let userTokenModel = require('../schema/userToken.model');
let userModel = require('../schema/user.model');

let _hash = function(password){
  return crypto.createHash('md5').update(password).digest('hex');
};

let validateCredentials = function (params, cb) {
    if(!params.email || !params.password){
        return cb(status.getStatus('input_missing'));
    }

    if(params.password){
        params.passwordHash = _hash(params.password);
    }

    async.waterfall([
        function (doneCallback) {
            userModel.find({email: params.email, password: params.passwordHash}, (err, result) => {
                if(err){
                    return doneCallback(err);
                }

                return doneCallback(null, result);
            })
        }

    ], function (err, result) {
       if(err){
           return cb(err);
       }

       return cb(null, result);
    });
};

let createSession = function (params, cb) {
    if (!params.userId || !params.token || !params.originId  || !params.expiryDate) {
        return cb(status.getStatus('input_missing'));
    }

    let userToken = new userTokenModel({
        userId: params.userId,
        token: params.token,
        expiryDate: params.expiryDate
    });

    userToken.save((err, result) => {
        if(err){
            return cb(err);
        }

        if(!result){
            return cb(null, null);
        }

        return cb(null, result);
    })
};

let getOriginById = function (originId, cb) {
    if(originId === 1 || originId === 2){
        return cb(null, true);
    }
    return cb(status.getStatus('origin_fail'));
};

let getSessionByToken = function (token, cb){
    userTokenModel.find({token: token}, function (err, result) {
        if(err){
            return cb(err);
        }

        if(!result || result.length === 0){
            return cb(null, null);
        }

        return cb(null, result[0]);
    })
};

let updateSession = function(params, cb){
    if(!params.sessionId){
        return cb(status.getStatus('input_missing'));
    }

    userTokenModel.update({sessionId: params.sessionId}, { $set : { expiryDate: params.expiryDate }}, (err, result) => {
        if(err){
            return cb(err);
        }

        if(!result || result.length === 0){
            return cb(null, null);
        }

        return cb(null, result);
    })
};

let deactivateSessionById = function (sessionId, cb) {
    userTokenModel.remove({token: sessionId}, (err, result) => {
        if(err){
            return cb(err);
        }

        return cb(null, true);
    })
};

let deactivateSessionByToken = function(token, cb){
  async.waterfall([
      function (doneCallback) {
          getSessionByToken(token, function (err, result) {
              if(err){
                  return doneCallback(err);
              }

              return doneCallback(null, result);
          });
      },

      function (session, doneCallback) {
          if (!session) {
              return doneCallback(status.getStatus('authn_fail'));
          }

          deactivateSessionById(session._id, function (err, result) {
              if(err){
                  return doneCallback(err);
              }

              return doneCallback(null, session._id);
          });
      }
  ], function (err, result) {
      if(err){
          return cb(err);
      }

      return cb(null, result);
  })
};

module.exports = {
    getOriginById: getOriginById,
    getSessionByToken: getSessionByToken,
    updateSession: updateSession,
    validateCredentials: validateCredentials,
    createSession: createSession,
    deactivateSessionByToken: deactivateSessionByToken
};
