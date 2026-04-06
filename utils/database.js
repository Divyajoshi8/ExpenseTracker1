const sequelize = require("sequelize");

const db = new sequelize("expense_tracker1", "root", "Divya&joshi8",{
    dialect: "mysql",
    host: "localhost",
});

module.exports = db;