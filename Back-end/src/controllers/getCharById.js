require("dotenv").config();
const axios = require("axios");
const { Dog, Temperaments } = require("../db");

const apiKey = process.env.API_KEY;
const apiUrl = "https://api.thedogapi.com/v1/breeds";

const getCharById = async (req, res) => {
  try {
    const { idRaza } = req.params;
    const isLocal = idRaza.startsWith("db");
    const originalId = isLocal ? idRaza : Number(idRaza);

    if (isLocal) {
      const dbDog = await Dog.findOne({
        where: {
          id: originalId,
        },
        include: Temperaments,
      });

      if (dbDog) {
        return res.status(200).json(dbDog);
      }
    }
    const apiDogsResponse = await axios.get(apiUrl, {
      headers: {
        "x-api-key": apiKey,
      },
    });

    const apiDog = apiDogsResponse.data.find((dog) => dog.id === originalId);

    if (apiDog) {
      return res.status(200).json(apiDog);
    }

    return res
      .status(404)
      .json({ message: "No se encontró la raza con ese ID." });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports = { getCharById };
