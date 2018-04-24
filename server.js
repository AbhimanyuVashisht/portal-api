'use strict';

// Include node packages
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Include config files
let config = require('./app/configs/config');
let status = require('./app/configs/status');

// Include middleware
let auths = require('./app/middlewares/auths');

// Include routers
let authsRouter = require('./app/routes/auths');

// URL Encoded body parser
app.use(bodyParser.urlencoded({
    extended: true
}));
// JSON body parser
app.use(bodyParser.json());

app.get('/ping', function (req, res) {
    res.send('pong');
});

// Configure middleware
app.use(auths);

// Configure routes
app.use('/auths', authsRouter);

// Global error handler
app.use(function (err, req, res, next) {
    if(err) {
        console.log(new Date().toISOString(). err);
    }

    if(err.error) {
        res.json(err);
    } else {
        let err = status.getStatus('generic_fail');
        res.json(err);
    }
});


// Run the server
app.listen(config.SERVER_PORT, config.SERVER_IP ,function(){
    console.log(`########## Environment: development ##########`);
    console.log(`${new Date()}: Server running on port ${config.SERVER_PORT}`);
});