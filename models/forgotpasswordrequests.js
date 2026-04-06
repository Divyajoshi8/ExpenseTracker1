// const Sequelize = require('sequelize');
// const sequelize = require('../utils/database');

// const ForgotPasswordRequests = sequelize.define("forgotpasswordrequests", {
//     uuid:{
//         type:Sequelize.STRING,
//       },
//     userId:{
//         type:Sequelize.INTEGER,
//     },
//     isactive:{
//         type:Sequelize.BOOLEAN,
//     }

const mongoose = require("mongoose");

const ForgotPasswordRequests = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});


const ResetPassword = mongoose.model("ResetPassword", ForgotPasswordRequests);

module.exports = ResetPassword;
// module.exports = ForgotPasswordRequests;