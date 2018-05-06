'use strict';

let async = require('async');
let firebase = require('firebase');

let status = require('../configs/status');

let trackModel = require('../models/tracks');

let secret = require('../secret');

let config = {
    apiKey: secret.FIREBASE_API,
    authDomain: `${secret.AUTH_DOMAIN}.firebaseapp.com`,
    databaseURL: `https://${secret.DATABASE_URL}.firebaseio.com`,
    projectId: secret.PROJECT_ID,
    storageBucket: `${secret.STORAGE_BUCKET}.appspot.com`,
    messagingSenderId: secret.MESSAGING_SENDER_ID
};
firebase.initializeApp(config);
let database = firebase.database();

let updateNotification = function (params, cb) {
    if(!params.stationId || !params.trainId || !params.distanceToNextStation || !params.speed || !params.waterLevel
        || !params.fuelLevel || !params.specialMessage){
        return cb(status.getStatus('input_missing'));
    }

    async.waterfall([
        function (doneCallback) {
            trackModel.getTrainById(params.trainId, (err, result) => {
               if(err){
                   return doneCallback(err);
               }

               return doneCallback(null, result, params.stationId, params);
            });
        },

        function (trainDetail, stationId, params, doneCallback) {
            let originDestinationIdParams = {
                originId: trainDetail.originId,
                destinationId: trainDetail.destinationId
            };

            trackModel.getOriginDestinationStationById(originDestinationIdParams, (err, result) => {
               if(err){
                   return doneCallback(err);
               }

                let updatedTrainDetail = {
                    trainId: trainDetail.trainId,
                    trainName: trainDetail.trainName,
                    type: trainDetail.type,
                    originStation: result[0].originStation,
                    destinationStation: result[1].destinationStation,
                    time: params.distanceToNextStation/params.speed,
                    waterLevel: params.waterLevel,
                    fuelLevel: params.fuelLevel,
                    specialMessage: params.specialMessage
                };

               doneCallback(null, updatedTrainDetail, stationId, params);
            });
        },

        function (trainDetail, stationId, params, doneCallback) {
            database.ref('station/' + stationId).set(trainDetail)
                .then(() => {
                    let updateParams = {};
                    updateParams.trainId = trainDetail.trainId;
                    updateParams.stationId = stationId;
                    updateParams.time = params.distanceToNextStation/params.speed;
                    trackModel.updateTrainRunningStatus(updateParams, (err, result) => {
                       if(err){
                           return doneCallback(err);
                       }
                       return doneCallback(null);
                    });
                })
                .catch((err) => doneCallback(err))
        },

        function (doneCallback) {
            let response = status.getStatus('success');
            return doneCallback(null, response);
        }

    ], function (err, done) {
        if(err){
            return cb(err);
        }

        return cb(null, done);
    })
};

let trackTrainById = function(params, cb){
    if(!params.trainId){
        return cb(status.getStatus('input_missing'));
    }

    async.waterfall([
        function (doneCallBack) {
            trackModel.getScheduleByTrainId(params.trainId, (err, result) => {
                if(err){
                    return doneCallBack(err);
                }

                doneCallBack(null, result.schedule, params.trainId);
            })
        },

        function (trainSchedule, trainId, doneCallback) {
            async.mapSeries(trainSchedule, function (item, callback) {
                trackModel.getStationById(item.stationId, (err, result) => {
                    if(err){
                        return callback(err);
                    }
                    let mergedResult = {};
                    mergedResult.stationDetail = result;
                    mergedResult.distanceFromNextStation = item.distanceFromNextStation;

                    callback(null, mergedResult);
                })
            }, function (err, result) {
                if(err){
                    return doneCallback(err);
                }

                return doneCallback(null, result, trainId);
            })
        },

        function (scheduleStationDetail, trainId, doneCallback) {
            trackModel.getTrainRunningStatusByTrainId(trainId, (err, result) => {
                if(err){
                    return doneCallback(err);
                }
                return doneCallback(null, result, scheduleStationDetail, trainId);
            })
        },

        function (runningStatus, scheduleTrain, trainId, doneCallback) {
            let response = status.getStatus('success');
            response.data = {};
            response.data.runningStatus = runningStatus;
            response.data.scheduleTrain = scheduleTrain;
            response.data.trainId = trainId;

            doneCallback(null, response);
        }

    ], function (err, done) {
        if(err){
            return cb(err);
        }

        return cb(null, done);
    })

};

module.exports = {
    updateNotification: updateNotification,
    trackTrainById: trackTrainById
};

