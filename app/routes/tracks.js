'use strict';

let router = require('express').Router();

let controller = require('../controllers/tracks');

router.post('/', controller.track);

module.exports = router;
