const express = require('express')
const router = express.Router()
const genera = require('../controllers/genera')




router.post('/creategenera',genera.createGenera)


module.exports = router