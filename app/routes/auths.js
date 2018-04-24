'use strict';

let router = require('express').Router();

let controller = require('../controllers/auths');

router.post('/login', controller.login);
router.put('/logout', controller.logout);

module.exports = router;