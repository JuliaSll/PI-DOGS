require("dotenv").config();
const { Sequelize } = require("sequelize");

const fs = require("fs");
const path = require("path");
const { DB_USER, DB_PASSWORD, DB_HOST } = process.env;

const dogModel = require("./models/Dog");
const dogAdoptionsModel = require("./models/DogAdoptions");
const temperamentsModel = require("./models/Temperaments");
const testimoniosModel = require("./models/Testimonios");
const usuariosModel = require("./models/Usuarios");

const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/dogs`,
  {
    logging: false,
    native: false,
  }
);
const basename = path.basename(__filename);

const modelDefiners = [];

fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

dogModel(sequelize);
temperamentsModel(sequelize);
dogAdoptionsModel(sequelize);
testimoniosModel(sequelize);
usuariosModel(sequelize);

const { Dog, Temperaments, DogAdoptions, Testimonios, Usuarios } =
  sequelize.models;

Dog.belongsToMany(Temperaments, { through: "DogTemperament" });
Temperaments.belongsToMany(Dog, { through: "DogTemperament" });

Usuarios.hasMany(DogAdoptions, { foreignKey: "userId" });
DogAdoptions.belongsTo(Usuarios, { foreignKey: "userId" });

Usuarios.hasMany(Testimonios, { foreignKey: "userId" });
Testimonios.belongsTo(Usuarios, { foreignKey: "userId" });

DogAdoptions.hasOne(Testimonios, { foreignKey: "dogAdoptionId" });
Testimonios.belongsTo(DogAdoptions, { foreignKey: "dogAdoptionId" });

DogAdoptions.belongsToMany(Temperaments, { through: "AdoptionTemperament" });
Temperaments.belongsToMany(DogAdoptions, { through: "AdoptionTemperament" });

module.exports = {
  ...sequelize.models,
  conn: sequelize,
  Dog,
  Temperaments,
  DogAdoptions,
  Testimonios,
  Usuarios,
};
