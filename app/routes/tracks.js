'use strict';

let router = require('express').Router();

let controller = require('../controllers/tracks');

router.post('/', controller.track);
router.get('/:id([0-9]{6})', controller.trackTrainById);

module.exports = router;
