const mongoose = require('mongoose')
const joi = require('joi')
const {moviesSchema} = require('./movie')
const {customerSchema} = require('./customer')


const rentalSchema = mongoose.Schema({
    movie:{
        type:moviesSchema,
        required:true,
    },
    customer:{
        type:customerSchema,
        required:true,
    },
    dateOut:{
       type:Date,
       required: true
    }
})

const rentalJoiSchema = joi.object({
    movie: joi.required(),
    customer:joi.required(),
    
})

function validation(rentalObj){
    return rentalJoiSchema.validate(rentalObj)
}
const rental = mongoose.model('Rental',rentalSchema)


module.exports = {rental,validation}

