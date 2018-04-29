let mongoose = require('mongoose');

let runningStatusSchema = mongoose.Schema({
    trainId: Number,
    stationId: Number,
    time: Number
});

module.exports = mongoose.model('runningStatus', runningStatusSchema);
