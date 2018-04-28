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

