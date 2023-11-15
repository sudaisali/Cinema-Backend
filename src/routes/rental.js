const express = require('express')
const router = express.Router()
const rental = require('../controllers/rental')




router.post('/createrental', rental.createRental)


module.exports = router