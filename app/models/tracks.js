'use strict';
let async = require('async');
let status = require('../configs/status');

let trainModel = require('../schema/train.model');
let stationModel = require('../schema/station.model');

let getTrainById = function(trainId, cb){
    if(!trainId){
        return cb(status.getStatus('input_missing'));
    }

    trainModel.find({trainId}, (err, result) => {
        if(err){
            return cb(err);
        }

        if(!result || result.length === 0){
            return cb(null, null);
        }

        return cb(null, result[0]);
    })

};

let getStationById = function (stationId, cb) {
    stationModel.find({stationId}, (err, result) => {
        if(err){
            return cb(err);
        }

        if(!result || result.length === 0){
            return cb(null, null);
        }

        return cb(null, result[0]);
    })
}; 

let getOriginDestinationStationById = function(params, cb){
    if(!params.originId || !params.destinationId){
        return cb(status.getStatus('input_missing'));
    }

    async.parallel([
        function (doneCallback) {
            getStationById(params.originId, (err, originStation) => {
               if(err){
                   return doneCallback(err);
               }

               if(originStation){
                   let result = {};
                   result.originStation = originStation.stationName;
                   return doneCallback(null, result);
               }
            });
        },

        function (doneCallback) {
            getStationById(params.destinationId, (err, destinationStation) => {
                if(err){
                    return doneCallback(err);
                }

                if(destinationStation){
                    let result = {};
                    result.destinationStation = destinationStation.stationName;
                    return doneCallback(null, result);
                }
            });
        }
    ], function (err, done) {
        if(err){
            return cb(err);
        }

        return cb(null, done);
    })
};

module.exports = {
    getTrainById: getTrainById,
    getOriginDestinationStationById: getOriginDestinationStationById
};