require("dotenv").config();
const axios = require("axios");
const { Dog, Temperaments } = require("../db");

const apiKey = process.env.API_KEY;
const apiUrl = "https://api.thedogapi.com/v1/breeds";

const getDogs = async (req, res) => {
  try {
    const dbDogs = await Dog.findAll({
      include: Temperaments,
    });

    const apiDogsResponse = await axios.get(apiUrl, {
      headers: {
        "x-api-key": apiKey,
      },
    });
    const apiDogs = apiDogsResponse.data;

    const allDogs = [...dbDogs, ...apiDogs];

    return res.status(200).json(allDogs);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports = { getDogs };
