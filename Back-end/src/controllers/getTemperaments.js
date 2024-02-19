require("dotenv").config();
const axios = require("axios");
const { Temperaments } = require("../db");

const apiKey = process.env.API_KEY;
const apiUrl = "https://api.thedogapi.com/v1/breeds";

const getTemperaments = async (req, res) => {
  try {
    const apiDogsResponse = await axios.get(apiUrl, {
      headers: {
        "x-api-key": apiKey,
      },
    });

    const apiTemperaments = apiDogsResponse.data.map((dog) => dog.temperament);

    const allTemperaments = apiTemperaments
      .join(",")
      .split(",")
      .map((temp) => temp.trim());

    const dbTemperaments = await Temperaments.findAll();
    const dbTemperamentNames = dbTemperaments.map((temp) => temp.name);

    const combinedTemperaments = [
      ...new Set([...allTemperaments, ...dbTemperamentNames]),
    ].sort();

    await Promise.all(
      combinedTemperaments.map((temp) => Temperaments.upsert({ name: temp }))
    );

    return res.status(200).json(combinedTemperaments);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports = { getTemperaments };
