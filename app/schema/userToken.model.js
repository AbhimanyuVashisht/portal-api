let mongoose = require('mongoose');

let userTokenSchema = new mongoose.Schema({
    userId: String,
    token: String,
    expiryDate: Date
});

module.exports = mongoose.model('userToken', userTokenSchema);