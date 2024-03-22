"use strict";

class ReturnMiddleware {
    return(data, req, res, next) {
        res.status(200).json(data);
        next();
    }
}

module.exports = new ReturnMiddleware();