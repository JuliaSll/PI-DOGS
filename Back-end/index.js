const server = require("./src/server");
const { conn } = require("./src/db.js");
const PORT = 3001;

conn
  .sync({ alter: true })
  .then(() => {
    console.log("Base de datos sincronizada correctamente");
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((error) =>
    console.error("Error durante la sincronización de la base de datos:", error)
  );
