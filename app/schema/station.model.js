let mongoose = require('mongoose');

let stationSchema = new mongoose.Schema({
   stationId: Number,
   stationName: String
});

module.exports = mongoose.model('station', stationSchema);