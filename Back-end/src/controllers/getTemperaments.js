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
    // Extrae solo los temperamentos de la respuesta
    const apiTemperaments = apiDogsResponse.data.map((dog) => dog.temperament);
    // Separa los temperamentos por coma y los convierte en un array
    const allTemperaments = apiTemperaments
      .join(",")
      .split(",")
      .map((temp) => temp.trim());

    const dbTemperaments = await Temperaments.findAll();
    const dbTemperamentNames = dbTemperaments.map((temp) => temp.name);

    // Elimina duplicados y ordena los temperamentos
    const combinedTemperaments = [
      ...new Set([...allTemperaments, ...dbTemperamentNames]),
    ].sort();

    // Actualiza los registros existentes o inserta nuevos
    await Promise.all(
      combinedTemperaments.map((temp) => Temperaments.upsert({ name: temp }))
    );

    // Envía los temperamentos únicos como respuesta
    return res.status(200).json(combinedTemperaments);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports = { getTemperaments };
