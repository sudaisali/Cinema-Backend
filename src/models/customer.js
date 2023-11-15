const Joi = require('joi')
const mongoose = require('mongoose')

const customerSchema = mongoose.Schema({
    name:{
        type:String,
        required:true

    },
    email:{
        type : String,
        unique:true,
        required:true

    },
    phoneNumber:{
        type:String,
        required:true,
        minLength:5,
        maxLength:15

    },
    isGold:{
        type:Boolean,
        default:false
    }
})

const customerJoiSchema = Joi.object({
    name:Joi.string().alphanum().min(3).max(20).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    phoneNumber: Joi.string().min(5).max(15).required(),
    isGold: Joi.boolean()

})

function validation(customerObject){
    return customerJoiSchema.validate(customerObject)
}

const customer = mongoose.model('Customer',customerSchema)

module.exports = {
    customer,validation,customerSchema
}