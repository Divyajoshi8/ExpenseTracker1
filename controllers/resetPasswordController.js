const path = require("path");
const { v4: uuid } = require("uuid");
const Sib = require('sib-api-v3-sdk');
const bcrypt = require('bcrypt');
require('dotenv').config();

const FPR = require('../models/forgotpasswordrequests');
const User = require('../models/userModel');

exports.forgotPasswordPage = async (req, res, next) => {
  try {
    res
      .status(200)
      .sendFile(
        path.join(__dirname, "../", "public", "views", "forgotPassword.html")
      );
  } catch (error) {
    console.log(error);
  }
};

exports.sendMail = async (req, res, next) => {
  try {
    const validEmail = await User.findOne({ where: { email: req.body.email } });
    if (!validEmail) {
      return res.status(400).json({ message: 'Invalid Email' });
    }
    const client = Sib.ApiClient.instance;
    const apiKey = client.authentications['api-key'];
    apiKey.apiKey = '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';
    const transEmailApi = new Sib.TransactionalEmailsApi();
    const sender = {
      email: 'joshidivya566@gmail.com',
      name: 'Divya',
    };
    const receivers = [{ email: req.body.email }];
    const sendUuid = uuid();
    await FPR.create({ uuid: sendUuid, userId: validEmail.id, isActive: true });
    const emailResponse = await transEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: 'Reset Your Password',
      textContent: `http://localhost:3000/password/resetPasswordPage/${sendUuid}`,
    });
    return res.status(200).json({ message: 'Reset password link has been sent to your email address!' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Failed to send reset password link.' });
  }
};
exports.resetPasswordPage = async (req, res, next) => {
  console.log("Reset Password Initiated");
  const reqId = req.params.requestId;
  console.log('reqId-----------------', reqId);
  const dbuuid = await FPR.findAll({where:{uuid:reqId}});
  console.log('dbuuid------------------', dbuuid);
  if(dbuuid.length === 0){
    res.status(500).send('Bad Request, try again');
  }
  if(dbuuid[0].isActive === false){
    res.status(500).send('Bad Request, try again');
  }
  res.status(200).send(`
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <title>Reset Password</title>
    
    <style>
            body{
    
    background-size: cover;
    color: black;
    font-family: Sans-Serif;
    }
    * {
    box-sizing: border-box;
  }
  .wrapper {
        position: absolute;
        top: 35%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        padding: 25px;
        border-radius: 0.8rem;
        box-sizing: border-box;
        background-color: white;
        border: 1px solid rgba(0, 0, 0, 0.2);
      }
      
      .wrapper h1 {
        font-size: 30px;
      }
      
      .wrapper h3 {
        font-size: 15px;
        font-weight: 400;
      }
      
      .wrapper .field {
        height: 40px;
        border: 1px solid rgba(0, 0, 0, 0.2);
      }
      
      .wrapper input[type=password] {
        width: 250px;
        height: 30px;
        outline: none;
        border: none;
        border-radius: 0.3rem;
        padding-left: 35px;
      }
      
      .wrapper span {
        position: absolute;
        color: black;
        padding: 4px;
      }
      
      .wrapper button {
        padding: 2px;
        width: 290px;
        height: 35px;
        border: none;
        border-radius: 0.3rem;
        color: white;
        background-color: black;
        margin-top: 10px;
      }
      .wrapper button:hover {
  background-color: grey;
  color: white;
  border-color: white;
}
      .link1 a {
        text-decoration: none;
        color: #007dff;
      }
    </style>
    <link
    rel="stylesheet"
    href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css"
  />
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet">
      <script>
        function formsubmitted(e){
            e.preventDefault();
            console.log('called')
        }
    </script>
  </head>
  <body>
    <div class="wrapper">
        <h2><i class="fa fa-lock fa-4x resetPassword"></i></h2>
      <h1>New Password</h1>
      <h3>Enter your new password here.</h3>
      <form class="inputs" action="/password/resetPassword/${dbuuid[0].id}" method="get">
        <div class="field">
          <span class="material-icons">edit</span>
          <input name="newpassword" type="password" placeholder="Enter New password" required>
        </div>
        <button type="submit">Reset Password</button>
    </form>
      <div class="link1">
        <p>Back To <a href="/">Signin.</a></p>
      </div>
    </div>
  </body>
</html>`);

  res.end();
}


exports.updatePassword = async (req, res, next) => {
  try {
    console.log(req.params); 
    const {newpassword} = req.query;
    const {resetpasswordid} = req.params;
    console.log(newpassword);
    console.log(resetpasswordid);
    const resetpasswordrequest = await FPR.findOne({ where : { id: resetpasswordid }});
    if (resetpasswordrequest) {
        const user = await User.findOne({where: { id : resetpasswordrequest.userId}});
        if(user) {
            //encrypt the password

            const saltRounds = 10;
            bcrypt.genSalt(saltRounds, async function(err, salt) {
                if(err){
                    console.log(err);
                    throw new Error(err);
                }
                const hash = await bcrypt.hash(newpassword, salt);
                // Store hash in your password DB.
                if(err){
                    console.log(err);
                    throw new Error(err);
                }
                await user.update({ password: hash });
                res.redirect(('/'))
                //res.status(201).json({message: 'Successfuly update the new password'})
            });
        } else{
            return res.status(404).json({ error: 'No user Exists', success: false})
        }
    } else {
      return res.status(404).json({ error: 'No reset password request exists', success: false});
    }
  } catch(error){
    return res.status(403).json({ error, success: false } )
}

}