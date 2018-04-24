'use strict';

let status = require('../configs/status');

let authService = require('../services/auths');

module.exports = function (req, res, next) {
  if(!req.headers['x-origin']){
      return next(status.getStatus('headers_missing'));
  }

  let originId = parseInt(req.headers['x-origin']);
  let token = req.headers['x-auth'];

  let whitelist = [
      /^\/auths\/(login)$/
  ];

  for(let i = 0; i < whitelist.length; i++){
      if(whitelist[i].test(req.originalUrl.split('?')[0])){
          return next();
      }
  }

  let validateParams = {};
  validateParams.originId = originId;
  validateParams.token = token;

  authService.validateSession(validateParams, function (err, result) {
      if(err){
        return next(err);
      }

      req._user = {};
      req._user.id = result._id;
      req._user.roleId = result.roleId;

      return next();
  });
};