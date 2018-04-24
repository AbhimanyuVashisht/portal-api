let mongoose = require('mongoose');

let trainSchema = new mongoose.Schema({
    trainId: Number,
    type: String,
    trainName: String,
    originId: Number,
    destinationId: Number,
    totalSeats: Number,
    arrivalTime: Date,
    departureTime: Date
});

module.exports = mongoose.model('train', trainSchema);