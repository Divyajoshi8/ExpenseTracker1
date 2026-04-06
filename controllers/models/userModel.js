const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isPremiumUser: {
    type: Boolean,
    default: false,
  },
  totalExpenses: {
    type: Number,
    default: 0,
  },
});
const User = mongoose.model("User", userSchema);

module.exports = User;























// const sequelize =  require('sequelize');
// const db = require('../utils/database');

// const User = db.define("users", {
//     id: {
//         type: sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true,
//     },
//     name: sequelize.STRING,
//     email: sequelize.STRING,
//     password: sequelize.STRING,
//     isPremiumUser: sequelize.BOOLEAN,
//     totalExpenses: {
//         type: sequelize.INTEGER,
//         defaultValue: 0,
//       },
// });

// module.exports = User;