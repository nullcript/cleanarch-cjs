'use strict';

const express = require("express");
const router = express.Router();

const BaseRoute = require('./v1/BaseRoute');

router.use('/v1', BaseRoute);

module.exports = router;