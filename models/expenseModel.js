const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Expense = mongoose.model("Expense", expenseSchema);





module.exports = Expense;







// const sequelize = require('sequelize');
// const db = require('../utils/database');

// const Expenses = db.define("expenses", {
//     id:{
//         type:sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true,
//     },
//     date:{
//         type:sequelize.STRING,
//         allowNull:true,
//     },
//     category:{
//         type:sequelize.STRING,
//         allowNull:true,
//     },
//     description:{
//         type:sequelize.STRING,
//         allowNull:true,
//     },
//     amount:{
//         type:sequelize.INTEGER,
//         allowNull:true,
//     },
// });

