"use strict";

const path = require("node:path");
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const {createClient} = require("redis");
const RedisStore = require("connect-redis").default;
const favicon = require("serve-favicon");


const database = require("./domain/models");
const apiRouter = require("./interfaces/routes");
const {rootDir} = require("./infrastructure/configs/mainConfigs");

class Application {
    #app = express();
    #PORT;
    #HOSTNAME;

    constructor(PORT, HOSTNAME) {
        this.#PORT = PORT;
        this.#HOSTNAME = HOSTNAME;
    }

    async boot() {
        await this.initGlobals();
        await this.initRedis();
        await this.configApplication();
        await this.createRoutes();
        await this.createServer();
    }

    async initGlobals() {
        global.database = database;
        global.cacheDatabase = await this.initRedis();
    }

    async initRedis() {
        const redisClient = await createClient().connect();
        redisClient.on("connect", () => console.log("Redis is connected!"));
        redisClient.on("error", (err) => console.log("Redis error :", err.message));
        redisClient.on("ready", () => console.log("Redis is ready to use!"));
        redisClient.on("end", () => console.log("Redis disconnected!"));
        return redisClient;
    }

    async configApplication() {
        this.#app.use(express.json());
        this.#app.use(express.urlencoded({extended: false}));
        this.#app.use(cookieParser(process.env.SECRET_COOKIE_KEY));
        this.#app.use(session({
            secret: process.env.SECRET_COOKIE_KEY,
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 60000,
                httpOnly: true,
                sameSite: "lax",
                secure: false
            },
            store: new RedisStore({
                client: await this.initRedis(),
                prefix: "sst: "
            }),
            unset: "destroy"
        }));
        this.#app.use("/public", express.static(path.join(rootDir, "public")));
        this.#app.use(favicon(path.join(rootDir, "public", "favicon.ico")));
    }

    async createRoutes() {
        this.#app.use("/api", apiRouter);
    }

    async createServer() {
        this.#app.listen(this.#PORT, this.#HOSTNAME, () => {
            console.log(`Express server is running on ${this.#HOSTNAME}:${this.#PORT}`);
        });
    }
}

module.exports = Application;


