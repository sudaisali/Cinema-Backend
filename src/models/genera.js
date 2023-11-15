const Joi = require('joi')
const mongoose = require('mongoose')

const generaSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        minLength:3,
        maxLength:255
    }
})

const generaJoiSchema = Joi.object({
    name:Joi.string().alphanum().min(3).max(255).required(),
})

function validation(generaObject){
    return generaJoiSchema.validate(generaObject)
}

const genera = mongoose.model('Genera',generaSchema)

module.exports = {
   generaSchema, genera,validation
}
