"use strict";

const express = require("express");
const {body} = require("express-validator");
const ReturnMiddleware = require("../../middlewares/ReturnMiddleware");
const ValidatorMiddleware = require("../../middlewares/ValidatorMiddleware");
const TestController = require("../../controllers/v1/TestController");

const {
    SequelizeTestRepository
} = require("../../../infrastructure/database/repositories");
const {
    TestUseCase
} = require("../../../application/usecases");

const testRepository = new SequelizeTestRepository("Test");
const testUseCase = new TestUseCase({testRepository});
const testController = new TestController(testUseCase);

const router = express.Router();

router.get("/get", testController.get.bind(testController), ReturnMiddleware.return);

module.exports = router;