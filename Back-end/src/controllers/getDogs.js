require("dotenv").config();
const axios = require("axios");
const { Dog, Temperaments } = require("../db");

const apiKey = process.env.API_KEY;
const apiUrl = "https://api.thedogapi.com/v1/breeds";

const getDogs = async (req, res) => {
  try {
    // Obtener razas de perros desde la base de datos
    const dbDogs = await Dog.findAll({
      include: Temperaments, // Incluye los temperamentos asociados a cada perro
    });

    const apiDogsResponse = await axios.get(apiUrl, {
      headers: {
        "x-api-key": apiKey,
      },
    });
    const apiDogs = apiDogsResponse.data;

    // Combinar las razas de perros de la base de datos y de The Dog API
    const allDogs = [...dbDogs, ...apiDogs];

    // Responder con el arreglo combinado
    return res.status(200).json(allDogs);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports = { getDogs };
