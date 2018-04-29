'use strict';

let status = require('../configs/status');

let trackService = require('../services/tracks');

let track = function (req, res, next) {
    if(!req.body.sid || !req.body.tid || !req.body.dtn || !req.body.speed){
        return next(status.getStatus('input_missing'));        
    }
    let params = {};
    params.stationId = parseInt(req.body.sid);
    params.trainId = parseInt(req.body.tid);
    params.distanceToNextStation = parseInt(req.body.dtn);
    params.speed = parseInt(req.body.speed);
    
    trackService.updateNotification(params, (err, result) => {
        if(err){
            return next(err);
        }   
        
        return res.json(result);
    })
};


let trackTrainById = function(req, res, next){
    if(!req.params.id){
        return next(status.getStatus('input_missing'));
    }

    let params = {};
    params.trainId = parseInt(req.params.id);

    trackService.trackTrainById(params, (err, result) => {
        if(err){
            return next(err);
        }

        return res.json(result);
    })
};

module.exports = {
    track: track,
    trackTrainById: trackTrainById
};