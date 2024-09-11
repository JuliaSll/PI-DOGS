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
router.get("/dogs", getDogs);
router.get("/dogs/name", getDogsByName);

router.get("/dogs/:idRaza", getCharById);
router.post("/dogs", postDog);

router.get("/temperaments", getTemperaments);

module.exports = { router };
