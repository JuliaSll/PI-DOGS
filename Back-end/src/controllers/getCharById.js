require("dotenv").config();
const axios = require("axios");
const { Dog, Temperaments } = require("../db");

const apiKey = process.env.API_KEY;
const apiUrl = "https://api.thedogapi.com/v1/breeds";

const getCharById = async (req, res) => {
  try {
    const { idRaza } = req.params;

    // Verificar si el ID tiene el prefijo "db"
    const isLocal = idRaza.startsWith("db");
    const originalId = isLocal ? idRaza : Number(idRaza);

    if (isLocal) {
      // Buscar en la base de datos local
      const dbDog = await Dog.findOne({
        where: {
          id: originalId,
        },
        include: Temperaments, // Incluimos los temperamentos asociados
      });

      // Si se encuentra en la base de datos, devuelve ese resultado
      if (dbDog) {
        return res.status(200).json(dbDog);
      }
    }
    // Si no se encuentra en la base de datos, intenta buscar en la API externa
    const apiDogsResponse = await axios.get(apiUrl, {
      headers: {
        "x-api-key": apiKey,
      },
    });

    // Busca el perro específico en la respuesta de la API
    const apiDog = apiDogsResponse.data.find((dog) => dog.id === originalId);

    if (apiDog) {
      return res.status(200).json(apiDog);
    }

    // Si no se encuentra en la API, devolver un mensaje de error
    return res
      .status(404)
      .json({ message: "No se encontró la raza con ese ID." });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports = { getCharById };
