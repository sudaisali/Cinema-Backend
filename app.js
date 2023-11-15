require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const userRouter = require('./src/routes/user')
const customerRouter =require('./src/routes/customer')
const generaRouter =require('./src/routes/genera')
const movieRouter = require('./src/routes/movie')
const rentalRouter = require('./src/routes/rental')
const authRouter = require('./src/routes/auth')

const app = express()
const dbString = process.env.DB_STRING
const port = process.env.PORT

app.use(express.json())

//Routes
app.use('/api/user',userRouter)
app.use('/api/customer',customerRouter)
app.use('/api/genera',generaRouter)
app.use('/api/movie',movieRouter)
app.use('/api/rental',rentalRouter)
app.use('/api/auth',authRouter)


//connect with db
mongoose.connect(dbString)
.then(()=>console.log("DataBase Connected..."))
.catch((error)=>console.log(error))

//listen server
app.listen(port,()=>console.log("Server is running...."))

