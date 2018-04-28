'use strict';

let async = require('async');
let firebase = require('firebase');

let status = require('../configs/status');

let trackModel = require('../models/tracks');

let config = {
    apiKey: "AIzaSyAk8XjZ_NlOHlVEk2HQ9pIxBQzmd4IbsWw",
    authDomain: "portal-3401.firebaseapp.com",
    databaseURL: "https://portal-3401.firebaseio.com",
    projectId: "portal-3401",
    storageBucket: "portal-3401.appspot.com",
    messagingSenderId: "983494927932"
};

let updateNotification = function (params, cb) {
    if(!params.stationId || !params.trainId){
        return cb(status.getStatus('input_missing'));
    }

    async.waterfall([
        function (doneCallback) {
            trackModel.getTrainById(params.trainId, (err, result) => {
               if(err){
                   return doneCallback(err);
               }

               return doneCallback(null, result, params.stationId);
            });
        },

        function (trainDetail, stationId, doneCallback) {
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
                    destinationStation: result[1].destinationStation
                };

               doneCallback(null, updatedTrainDetail, stationId);
            });
        },

        function (trainDetail, stationId, doneCallback) {
            firebase.initializeApp(config);

            let database = firebase.database();
            database.ref('station/' + stationId).set(trainDetail)
                .then(() => doneCallback(null))
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

module.exports = {
    updateNotification: updateNotification
};

