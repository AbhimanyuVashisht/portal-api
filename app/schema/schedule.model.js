let mongoose = require('mongoose');

let scheduleSchema = new mongoose.Schema({
   trainId: Number,
   schedule: [{
       stationId: Number,
       arrivalTime: Date,
       departureTime: Date,
       distanceFromNextStation: Number
   }]
});

module.exports = mongoose.model('schedule', scheduleSchema);