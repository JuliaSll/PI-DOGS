const { Dog, Temperaments } = require("../db");
const { Sequelize } = require("sequelize");
const axios = require("axios");
require("dotenv").config();

const apiKey = process.env.API_KEY;
const apiUrl = "https://api.thedogapi.com/v1/breeds";

const getDogsByName = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res
        .status(400)
        .json({ error: "Se requiere el parámetro 'name'." });
    }

    const dbDogs = await Dog.findAll({
      where: {
        name: {
          [Sequelize.Op.iLike]: `%${name}%`,
        },
      },
      include: Temperaments,
    });

    const apiResponse = await axios.get(apiUrl, {
      headers: {
        "x-api-key": apiKey,
      },
    });

    const apiDogs = apiResponse.data.filter((dog) =>
      dog.name.toLowerCase().includes(name.toLowerCase())
    );

    const combinedDogs = [...dbDogs, ...apiDogs];

    if (combinedDogs.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron razas de perros con ese nombre." });
    }

    return res.status(200).json(combinedDogs);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports = { getDogsByName };
