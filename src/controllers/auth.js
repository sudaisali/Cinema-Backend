const {user , signToken} = require('../models/user')
const crypto = require('crypto')
const {sendEmail} = require('../middlewares/sendMail')

module.exports={
    verifyUser: async (req, res, next) => {
        const accountVerificationToken = req.params.token;
        const encryptToken = crypto.createHash('sha256').update(accountVerificationToken).digest('hex');

        try {
            const verifyUser = await user.findOne({ verificationToken: encryptToken, verificationTokenExpiry: { $gt: Date.now() } });

            if (!verifyUser) {
                const error =  res.status(400).send({
                    message:"Verification Token Expire"
                })
               
               return next(error)
            }

            verifyUser.isVerified = true;
            verifyUser.verificationToken = null;
            verifyUser.verificationTokenExpiry = null;
            await verifyUser.save({ validateBeforeSave: false });

            res.status(200).json({
                status: "success",
                message: "You are Verified Successfully"
            });
        } catch (error) {
            const err = res.send({
                message:error.message
            }) 
            return next(err); 
        }
    },
    loginUser: async (req, res, next) => {
        try{
        const { email, password } = req.body
        //check user enter email and password
        if (!email || !password) {
            const error = res.json({
                "message": "Please Enter Email and Password"
            })
            return next(error)
        }
        //check password and email both are match 
        const loginUser = await user.findOne({ email }).select('+password')
        
        if (!loginUser || !(await loginUser.comparePass(password, loginUser.password))) {
            const error = res.json({
                "message": "Please Enter Correct Email & Password"
            })
            return next(error)
        }
        if (loginUser.isVerified == false) {
            const error = res.json({
                message: "Sorry Your account is not verified"
            })
             return next(error)
        }
        //If above condition pass then generate token
        const token = signToken(loginUser)
        res.status(200).json({
            status: "success",
            token,
            message: "You are Login Successfully"
        })
    }catch (error) {

        const err = res.json({
            message:error.message
        }) 
        return next(err); 
    }


    },
    forgetPassword: async (req, res, next) => {
        try {
            // 1- get user based on email
            const forgetUser = await user.findOne({ email: req.body.email });
    
            if (!forgetUser) {
                return res.status(404).json({
                    message: "User with this email does not exist"
                });
            }
    
            // 2- generate random reset token
            const resetToken = forgetUser.createResetToken();
    
            // save password verification token and expiry in db
            await forgetUser.save({ validateBeforeSave: false });
    
            // 3- send back token to the user email
            const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetpassword/${resetToken}`;
            const message = `Reset your password by using the link:\n\n${resetUrl}\n\n`;
    
            // Send email and handle errors
            await sendEmail({
                email: forgetUser.email,
                subject: "Password change message",
                message: message
            });
    
            // Success response if the email is sent successfully
            return res.status(200).json({
                status: "success",
                message: "Password reset link sent to your email"
            });
        } catch (error) {
            // Handle errors
            if (error.name === "ValidationError") {
                return res.status(400).json({ status: "error", message: error.message });
            }
    
            // Rollback changes if needed
            forgetUser.passwordResetToken = undefined;
            forgetUser.passwordResetTokenExpiry = undefined;
            await forgetUser.save({ validateBeforeSave: false });
    
            return next(error);
        }
    },
    resetPassword: async (req, res, next) => {
        try{
        //get ResetToken from url params
        const passwordResetToken = req.params.token
        const encryptToken = crypto.createHash('sha256').update(passwordResetToken).digest('hex');
        const resetUser = await user.findOne({ passwordResetToken: encryptToken, passwordResetTokenExpiry: { $gt: Date.now() } })
        if (!resetUser) {
            const error = res.json({
                status: "Failed",
                message: "Password Token is expired"
            })
            next(error)
        }
        resetUser.password = req.body.password;
        resetUser.passwordResetToken = undefined;
        resetUser.passwordResetTokenExpiry = undefined;
        resetUser.passwordUpdatedAt = Date.now();
        //find user with the help of token
        //check Token expiry from current data
        //update new password
        resetUser.save()
        res.status(200).json({
            status: "success",
            message: "Password Changed SuccessFully"
        })
    }catch (error) {

        const err = res.json({
            message:error.message
        }) 
        return next(err); 
    }


    }
    
}

