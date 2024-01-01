// controllers
const { getDogs } = require("../controllers/getDogs");
const { getCharById } = require("../controllers/getCharById");
const { getDogsByName } = require("../controllers/getDogsByName");
const { postDog } = require("../controllers/postDog");
const { getTemperaments } = require("../controllers/getTemperaments");

// express config
const express = require("express");
const router = express.Router();

// routes
router.get("/dogs", getDogs); //ya esta
router.get("/dogs/name", getDogsByName); //ya esta
router.get("/dogs/:idRaza", getCharById); // ya esta
router.post("/dogs", postDog); // ya esta
router.get("/temperaments", getTemperaments); //ya esta

module.exports = { router };
