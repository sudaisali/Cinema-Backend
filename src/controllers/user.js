const {user,validation} = require('../models/user')
const {sendEmail} = require('../middlewares/sendMail')

const createUser = async (req, res) => {
   let newUser;
   const { error } = validation(req.body);
   if (error) {
     return res.status(422).json({ message: error.details[0].message });
   }
   
   try {
     newUser = await user.create(req.body);
     const verificationToken = newUser.createVerificationToken();
     newUser.save({ validateBeforeSave: false });
 
     const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/verifyuser/${verificationToken}`;
     const message = `Verify Your account  by using below link\n\n${resetUrl}\n\n`;
 
     await sendEmail({
       email: newUser.email,
       subject: "Account Verification Email",
       message: message
     });
 
     // Success response only after the email is sent successfully
     return res.status(200).json({
       status: "success",
       message: "Account Verification email link sent to your email"
     });
   } catch (error) {
     // Handle errors, rollback changes if needed
     if(newUser){
      newUser.verificationToken = undefined;
      newUser.verificationTokenExpiry = undefined;
      newUser.save({ validateBeforeSave: false });
     }
    
     return res.status(400).json({
       status: "error",
       message: error.message
     });
   }
 };
 


module.exports = { createUser }