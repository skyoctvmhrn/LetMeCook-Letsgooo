const {Sequelize} = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const sequelize = new Sequelize("letmecook", "letmecook", "letmecook", {
    host: "34.34.219.15",
    dialect: "mysql",
    port: 3306, // Port default MySQL
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // Bisa diatur ke `true` jika ada CA Certificate
        }
    },
    logging: console.log
});

module.exports = sequelize;
