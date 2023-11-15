const express = require('express')
const router = express.Router()
const movies = require('../controllers/movie')




router.post('/createmovie',movies.createMovie)


module.exports = router