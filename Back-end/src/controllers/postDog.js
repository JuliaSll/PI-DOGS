require("dotenv").config();
const { Dog, Temperaments } = require("../db");

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

    const lastDog = await Dog.findOne({
      order: [["id", "DESC"]],
    });

    const lastId = lastDog ? Number(String(lastDog.id).replace(/^db/, "")) : 0;
    const nextId = lastId + 1;

    const originalId = nextId.toString();

    const newDog = await Dog.create({
      name,
      image,
      height,
      weight,
      lifeSpan,
      id: `db${originalId}`,
    });

    const temperamentsArray = Array.isArray(temperament)
      ? temperament
      : temperament.split(",");

    const createdTemperaments = await Promise.all(
      temperamentsArray.map(async (temp) => {
        const [createdTemperament] = await Temperaments.findOrCreate({
          where: { name: temp.trim() },
        });

        return createdTemperament.id;
      })
    );

    //setTemperaments se utiliza para establecer las asociaciones entre el perro y los temperamentos
    await newDog.setTemperaments(createdTemperaments);

    //getTemperaments se utiliza para recuperar los temperamentos asociados al perro después de haber sido creados y asociados
    const dogTemperaments = await newDog.getTemperaments();
    const temperamentNames = dogTemperaments.map((temp) => temp.name);

    const temperamentsString = temperamentNames.join(",");

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
    return res.status(500).send(error.message);
  }
};

module.exports = { postDog };
