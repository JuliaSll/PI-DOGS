require("dotenv").config();
const { Sequelize } = require("sequelize");

const fs = require("fs");
const path = require("path");
const { DB_USER, DB_PASSWORD, DB_HOST } = process.env;

//Importa tus modelo
const dogModel = require("./models/Dog");
const temperamentsModel = require("./models/Temperaments");

//Configuura Sequelize
const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/dogs`,
  {
    logging: false,
    native: false,
  }
);
const basename = path.basename(__filename);

// Lee los archivos de modelos y los carga en Sequelize
const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

//Define tus modelos
dogModel(sequelize);
temperamentsModel(sequelize);

// Aca vendrian las relaciones

const { Dog, Temperaments } = sequelize.models;
Dog.belongsToMany(Temperaments, { through: "TemperamentDog" });
Temperaments.belongsToMany(Dog, { through: "TemperamentDog" });

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importart la conexión { conn } = require('./db.js');
  Dog,
  Temperaments,
};
