const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Testimonios",
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );
};
