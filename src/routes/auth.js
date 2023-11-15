const express = require('express')
const router = express.Router()
const auth = require('../controllers/auth')




router.post('/login',auth.loginUser)
router.patch('/verifyuser/:token', auth.verifyUser)
router.post('/resetpassword', auth.forgetPassword)
router.patch('/resetpassword/:token', auth.resetPassword)


module.exports = router