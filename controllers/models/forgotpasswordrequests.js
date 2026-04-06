const mongoose = require("mongoose");

const ForgotPasswordRequests = new mongoose.Schema({
  uuid: {
    type: String,
    required: true,
    unique: true, // ✅ important
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // optional but good practice
    required: true,
  },
}, { timestamps: true });

const ResetPassword = mongoose.model("ResetPassword", ForgotPasswordRequests);

module.exports = ResetPassword;