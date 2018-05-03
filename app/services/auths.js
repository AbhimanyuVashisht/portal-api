'use strict';

let async =  require('async');
let uuid = require('uuid');

let status = require('../configs/status');

let authsModel = require('../models/auths');
let userModel =  require('../models/users');

let utilsServices = require('./utils');

let login = function (params, cb) {
    if(!params.email || !params.password || !params.originId){
        return cb(status.getStatus('input_missing'));
    }

    async.waterfall([
        function (doneCallback) {
            let originParams = {};
            originParams.originId = params.originId;

            _validateOrigin(originParams, function (err, result) {
                if(err){
                    return doneCallback(err);
                }

                return doneCallback(null);
            });
        },
        
        function (doneCallback) {
            let credParams = {};
            credParams.email = params.email;
            credParams.password = params.password;

            authsModel.validateCredentials(credParams, function (err, result) {

                if(err){
                    return doneCallback(err);
                }

                if(!result || result.length === 0){
                    return doneCallback(status.getStatus('authn_fail'));
                }

                return doneCallback(null, result[0]._id);
            });
        },
        
        function (userId, doneCallback) {
            let sessionParams = {};
            sessionParams.userId = userId;
            sessionParams.token = uuid.v4().replace(/\-/g, '');
            sessionParams.originId = params.originId;
            sessionParams.expiryDate = utilsServices.addDays(new Date(), 180);

            authsModel.createSession(sessionParams, function (err, result) {
                if(err){
                    return doneCallback(err);
                }

                let session = {
                    token: sessionParams.token
                };

                return doneCallback(null, userId, session);
            });
        },

        function (userId, session, doneCallback) {
            userModel.getUserById(userId, function (err, result) {
                if(err){
                    return doneCallback(err);
                }

                if(!result || result.length === 0){
                    return doneCallback(status.getStatus('user_missing'));
                }

                let user = {
                    id: userId,
                    name: result[0].displayName,
                    roleId: result[0].roleId,
                    stationPosted: result[0].stationPosted
                };

                return doneCallback(null, userId, user, session);
            });
        },

        function (user_id, user, session, doneCallback) {
            let response = status.getStatus('success');
            response.data = {};
            response.data.user = user;
            response.data.session = session;
            return doneCallback(null, response);
        }
    ], function (err, result) {
        if(err){
            return cb(err);
        }
        return cb(null, result);
    })
};

let logout = function (params, cb) {
    if(!params.sessionToken){
        return cb(status.getStatus('input_missing'));
    }

    async.waterfall([
        function (doneCallback) {
            authsModel.deactivateSessionByToken(params.sessionToken, function (err, result) {
                if (err) {
                    return doneCallback(err);
                }

                return doneCallback(null, result);
            });
        },

        function (sessionId, doneCallback) {
            let response = status.getStatus('success');
            response.data = {};
            response.data.session = {};
            response.data.session.id = sessionId;

            return doneCallback(null, response);
        }
    ], function (err, result) {
        if(err){
            return cb(err);
        }

        return cb(null, result);
    });
};

let _validateOrigin = function (params, cb) {
    if(!params.originId){
        return cb(status.getStatus('input_missing'));
    }

    authsModel.getOriginById(params.originId, (err, result) => {
       if(err){
           return cb(err);
       }

       return cb(null, true);

    });
};

let validateSession = function (params, cb) {
  if(!params.token || !params.originId){
      return cb(status.getStatus('input_missing'));
  }
  
  async.waterfall([
      function (doneCallback) {
          let originParams = {};
          originParams.originId = params.originId;

          _validateOrigin(originParams, function (err, result) {
              if(err){
                  return doneCallback(err);
              }

              if(!result) {
                  return doneCallback(status.getStatus('authn_fail'));
              }else {
                  return doneCallback(null);
              }
          });
      },

      function (doneCallback) {
        authsModel.getSessionByToken(params.token, function (err, result) {
            if(err){
                return doneCallback(err);
            }

            if(!result) {
                return doneCallback(status.getStatus('authn__fail'));
            }

            return doneCallback(null, result);
        })
      },
      
      function (session, doneCallback) {
          if(new Date(session.expiryDate) <= new Date()){
              return doneCallback(status.getStatus('authn_fail'));
          }

          let updateParams = {};
          updateParams.sessionId = session._id;
          updateParams.expiryDate = utilsServices.addDays(new Date(), 180);

          authsModel.updateSession(updateParams, function (err, result) {
              if(err){
                  return doneCallback(err);
              }

              session.expiryDate = updateParams.expiryDate;

              return doneCallback(null, session);
          });
      },

      function (session, doneCallback) {
          userModel.getUserById(session.userId, function (err, result) {
              if(err){
                 return doneCallback(err);
              }

              if(!result){
                  return doneCallback(status.getStatus('user_missing'));
              }

              return doneCallback(null, result[0]);
          })
      }
  ], function (err, result) {
      if(err){
          return cb(err);
      }

      return cb(null, result);
  })
};


module.exports = {
    login: login,
    logout: logout,
    validateSession: validateSession
};