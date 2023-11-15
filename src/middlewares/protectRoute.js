
const jwt =  require('jsonwebtoken')
const {user} = require('../models/user')



module.exports = {
authorizeUser: async (req, res, next) => {
    
        //1 - Read The Token If it Exist

        const token = req.headers.authorization
        let tokenValue
        if (token && token.startsWith('Bearer')) {
            tokenValue = token.split(' ')[1]
        }
        if (!token) {
            const error = res.json({
                message: "Sorry You are Not Logged in"
            })
            return next(error)
        }
        try {
        //2-Validate Token
        const decodeToken = await jwt.verify(tokenValue, process.env.SECERET_STRING)

        //3-Check User Exist
        const loginUser = await user.findById(decodeToken.id)
        if (!loginUser) {
            const error = res.json({
                message: "User with given Token Does Not Exist"
            })
            return next(error)
        }
      //4- If password change after token generated
      if (loginUser.isPasswordChanged(decodeToken.iat)) {
        const error = {
            message: "Password has been changed."
        };
        return res.status(400).json(error);
    }
        next()
    } catch (error) {
       return  res.status(401).json({
            message: error.message
        })
    }
}

}