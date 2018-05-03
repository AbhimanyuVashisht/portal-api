'use strict';

// Include node packages
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

// Include config files
let config = require('./app/configs/config');
let status = require('./app/configs/status');

// Include middleware
let auths = require('./app/middlewares/auths');

// Include routers
let authsRouter = require('./app/routes/auths');
let tracksRouter = require('./app/routes/tracks');

// URL Encoded body parser
app.use(bodyParser.urlencoded({
    extended: true
}));
// JSON body parser
app.use(bodyParser.json());

// Set Allowed Headers
app.use(function (req, res, next) {
   res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization,X-Origin,X-Auth');
   res.setHeader('Access-Control-Allow-Origin', ['*']);

   next();
});

app.get('/ping', function (req, res) {
    res.send('pong');
});

// Configure logging
logger.token('req-body', function (req, res) {
    return JSON.stringify({
        params: req.query,
        body: req.body
    });
});

logger.token('req-headers', function (req, res) {
    return JSON.stringify(req.headers);
});

logger.token('tracking', function (req, res) {
    return req.headers['x-device-id'] ? req.headers['x-device-id'] : 'DEFAULT';
});

logger.token('uri', function (req, res) {
    return req.originalUrl.split('?')[0];
});

let customLogFormat = ':date[iso] :method :uri :status : response-time :tracking :req-headers :req-body';
let accessLogStream = fs.createWriteStream(config.MORGAN_LOG_PATH + '/morgan.log', {
    flags: 'a'
});

// logger middleware
app.use(logger(customLogFormat, {
    stream: accessLogStream
}));

// Configure middleware
app.use(auths);

// Configure routes
app.use('/auths', authsRouter);
app.use('/tracks', tracksRouter);

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
