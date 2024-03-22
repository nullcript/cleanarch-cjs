'use strict';

const express = require('express');
const router = express.Router();

const TestRoutes = require('./TestRoutes');

router.use("/Test", TestRoutes);

module.exports = router;