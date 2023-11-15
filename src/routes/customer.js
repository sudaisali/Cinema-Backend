const express = require('express')
const router = express.Router()
const customer = require('../controllers/customer')
const routeProtection = require('../middlewares/protectRoute')



router.post('/createcustomer',routeProtection.authorizeUser,customer.createCustomer)


module.exports = router