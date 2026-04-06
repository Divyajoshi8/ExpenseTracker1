const path = require("path");
const { v4: uuid } = require("uuid");
const Sib = require("sib-api-v3-sdk");
const bcrypt = require("bcrypt");
require("dotenv").config();

const FPR = require("../models/forgotpasswordrequests");
const User = require("../models/userModel");


// ================= FORGOT PASSWORD PAGE =================
exports.forgotPasswordPage = async (req, res) => {
  try {
    res.status(200).sendFile(
      path.join(__dirname, "../", "public", "views", "forgotPassword.html")
    );
  } catch (error) {
    console.log(error);
    res.status(500).send("Error loading page");
  }
};


// ================= SEND RESET EMAIL =================
exports.sendMail = async (req, res) => {
  try {
    console.log("Incoming email:", req.body.email);

    const email = req.body.email?.toLowerCase();

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // ✅ MongoDB query (FIXED)
    const user = await User.findOne({ email: email });

    console.log("User found:", user);

    if (!user) {
      return res.status(400).json({ message: "Invalid Email" });
    }

    // ✅ Brevo setup
    const client = Sib.ApiClient.instance;
    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.API_KEY_P;

    const transEmailApi = new Sib.TransactionalEmailsApi();

    // ✅ Generate token
    const resetToken = uuid();

    await FPR.create({
      uuid: resetToken,
      userId: user._id,   // ✅ MongoDB uses _id
      isActive: true,
    });

    // ✅ Send mail
    await transEmailApi.sendTransacEmail({
      sender: {
        email: process.env.SENDER_EMAIL,
        name: "Divya",
      },
      to: [{ email: email }],
      subject: "Reset Your Password",
      textContent: `Click to reset your password: http://localhost:${process.env.PORT}/password/resetPasswordPage/${resetToken}`,
    });

    return res.status(200).json({
      message: "Reset password link sent successfully!",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error sending reset email",
    });
  }
};


// ================= RESET PASSWORD PAGE =================
exports.resetPasswordPage = async (req, res) => {
  try {
    const { requestId } = req.params;

    // ✅ MongoDB query (FIXED)
    const request = await FPR.findOne({ uuid: requestId });

    if (!request || request.isActive === false) {
      return res.status(400).send("Invalid or expired link");
    }

    res.status(200).send(`
      <html>
        <head>
          <title>Reset Password</title>
        </head>
        <body style="font-family: Arial; text-align:center; margin-top:100px;">
          <h2>Reset Password</h2>
          <form action="/password/resetPassword/${request._id}" method="POST">
            <input type="password" name="newpassword" placeholder="Enter new password" required />
            <br><br>
            <button type="submit">Reset Password</button>
          </form>
        </body>
      </html>
    `);

  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
};


// ================= UPDATE PASSWORD =================
exports.updatePassword = async (req, res) => {
  try {
    const { resetpasswordid } = req.params;
    const { newpassword } = req.body;

    if (!newpassword) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    // ✅ Find reset request
    const request = await FPR.findById(resetpasswordid);

    if (!request || request.isActive === false) {
      return res.status(400).json({
        message: "Invalid or expired request",
      });
    }

    // ✅ Find user
    const user = await User.findById(request.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(newpassword, 10);

    // ✅ Update password
    user.password = hashedPassword;
    await user.save();

    // ✅ Deactivate link
    request.isActive = false;
    await request.save();

    res.send(`
      <h2>Password updated successfully ✅</h2>
      <a href="/">Go to Login</a>
    `);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error updating password",
    });
  }
};