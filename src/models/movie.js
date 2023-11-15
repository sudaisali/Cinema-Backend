const mongoose = require('mongoose')
const {generaSchema} = require('./genera')
const joi = require('joi')

const moviesSchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
        minLength:5,
        maxLength:255

    },
    description:{
        type:String,
        required:true,
        minLength:5,
        maxLength:255
    },
    dailyRentalRate:{
        type:Number,
        required : true,
        minLength:0,
        maxLength:255
    },
    numberInStock:{
        type:Number,
        required : true,
        minLength:0,
        maxLength:255

    },
    genera :{
        type : generaSchema,
        required:true
    }

})

const validation = (userObject)=>{
    return moviesJoiSchema.validate(userObject)
}

const moviesJoiSchema = joi.object({
    title: joi.string().alphanum().min(5).max(255).required(),
    description: joi.string().min(5).max(255).required(),
    dailyRentalRate:joi.number().min(5).max(255).required(),
    numberInStock:joi.number().min(5).max(255).required(),
    genera:joi.required()
   
})
const movie = mongoose.model('Movie',moviesSchema)

module.exports = {
    moviesSchema,
    movie,
    validation
}