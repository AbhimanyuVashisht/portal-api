let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    roleId: Number,
    displayName: String,
    email: String,
    phone: Number,
    password: String,
    stationPosted: Number
});

module.exports = mongoose.model('user', userSchema);