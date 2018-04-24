let mongoose = require('mongoose');

let notificationSchema = new mongoose.Schema({
    stationId: Number,
    message: String
});

module.exports = mongoose.model('notification', notificationSchema);