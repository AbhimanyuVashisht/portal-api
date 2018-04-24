'use strict';

let status = require('../configs/status');

let authService = require('../services/auths');

let login = function (req, res, next) {
    if(!req.body.email || !req.body.password){
        return next(status.getStatus('input_missing'));
    }

    let loginParams = {};
    loginParams.email = req.body.email;
    loginParams.password = req.body.password;
    loginParams.originId = parseInt(req.headers['x-origin']);

    authService.login(loginParams, function (err, result) {
        if(err){
            return next(err);
        }
        return res.json(result);
    });
};

let logout = function (req, res, next){
    let logoutParams = {};
    logoutParams.sessionToken = req.headers['x-auth'];

    authService.logout(logoutParams, function (err, result) {
        if (err) {
            return next(err);
        }

        return res.json(result);
    });
};

module.exports = {
    login: login,
    logout: logout
};

