'use strict';

let status = require('../configs/status');

let trackService = require('../services/tracks');

let track = function (req, res, next) {
    if(!req.body.sid || !req.body.tid){
        return next(status.getStatus('input_missing'));        
    }
    let params = {};
    params.stationId = parseInt(req.body.sid);
    params.trainId = parseInt(req.body.tid);
    
    trackService.updateNotification(params, (err, result) => {
        if(err){
            return next(err);
        }   
        
        return res.json(result);
    })
};

module.exports = {
    track: track
};