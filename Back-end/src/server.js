/* server config */
const express = require("express");
const server = express();

/* routers */
const { router } = require("./routes/index");

/* middlewares */
const morgan = require("morgan");
const cors = require("cors");
server.use(morgan("dev"));
server.use(express.json());
server.use(cors());

server.use(router);

module.exports = server;
