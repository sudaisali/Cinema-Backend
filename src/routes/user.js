const express = require('express')
const router = express.Router()
const user = require('../controllers/user')


router.post('/createuser',user.createUser)


module.exports = router