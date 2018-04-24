let mongoose = require('mongoose');

let scheduleSchema = new mongoose.Schema({
   trainId: Number,
   schedule: [{
       stationId: String,
       arrivalTime: Date,
       departureTime: Date
   }]
});

module.exports = mongoose.model('schedule', scheduleSchema);