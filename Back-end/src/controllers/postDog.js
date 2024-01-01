require("dotenv").config();
const axios = require("axios");
const { Dog, Temperaments } = require("../db");

const apiKey = process.env.API_KEY;
const apiUrl = "https://api.thedogapi.com/v1/breeds";

const postDog = async (req, res) => {
  try {
    const { name, image, height, weight, lifeSpan, temperament } = req.body;

    if (!name || !image || !height || !weight || !lifeSpan || !temperament)
      return res.status(400).json({ error: "Faltan datos " });

    const existingDog = await Dog.findOne({
      where: { name: name },
    });
    if (existingDog) {
      return res.status(400).json({
        error: "Ya existe un Perro de esta raza. Por favor, elija otra raza.",
      });
    }

    const apiDogsResponse = await axios.get(`${apiUrl}/dogs?name=${name}`, {
      headers: {
        "x-api-key": apiKey,
      },
    });
    const existingapiDogs = apiDogsResponse.data;
    if (existingapiDogs.length > 0) {
      return res.status(400).json({
        error:
          "Ya existe un Perro de esta raza en la API. Por favor, elija otra raza.",
      });
    }
    // Obtén el último ID de la base de datos y calcula el siguiente
    const lastDog = await Dog.findOne({
      order: [["id", "DESC"]],
    });

    const lastId = lastDog ? Number(String(lastDog.id).replace(/^db/, "")) : 0;
    const nextId = lastId + 1;

    const originalId = nextId.toString();

    console.log("Antes de la creación del nuevo perro");
    const newDog = await Dog.create({
      name,
      image,
      height,
      weight,
      lifeSpan,
      id: `db${originalId}`,
    });
    console.log("Después de la creación del nuevo perro");

    const temperamentsArray = Array.isArray(temperament)
      ? temperament
      : temperament.split(",");

    const createdTemperaments = await Promise.all(
      temperamentsArray.map(async (temp) => {
        // Buscar o crear el temperamento en la base de datos local
        const [createdTemperament, created] = await Temperaments.findOrCreate({
          where: { name: temp.trim() }, // Trim para eliminar espacios en blanco
        });
        // Devolver el ID del temperamento creado o existente
        return createdTemperament.id;
      })
    );
    // Asocia el perro a los temperamentos en la base de datos local
    await newDog.setTemperaments(createdTemperaments);

    // Obtiene los nombres de los temperamentos asociados al perro
    const dogTemperaments = await newDog.getTemperaments();
    const temperamentNames = dogTemperaments.map((temp) => temp.name);

    const temperamentsString = temperamentNames.join(",");
    // Construye la respuesta que incluye el array de temperamentos
    const response = {
      id: newDog.id,
      name: newDog.name,
      image: newDog.image,
      height: newDog.height,
      weight: newDog.weight,
      lifeSpan: newDog.lifeSpan,
      temperament: temperamentsString,
    };

    return res.status(201).json(response);
  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).send(error.message);
  }
};

module.exports = { postDog };
