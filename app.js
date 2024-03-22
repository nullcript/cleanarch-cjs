"use strict";

require("dotenv").config();
const Application = require("./src/server");

const application = new Application(process.env.APP_PORT, process.env.APP_HOSTNAME);

(async () => {
    await application.boot();
})();