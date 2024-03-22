"use strict";

const BaseController = require("./BaseController");

class TestController extends BaseController {
    constructor(useCase) {
        super(useCase);
    }

    async get(req, res, next) {
        const result = await this.useCase.get(req, res);
        return next(result);
    }
}

module.exports = TestController;