const mongoose = require('mongoose')
const bcrypt  = require('bcrypt')
const joi = require('joi')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const userSchema = mongoose.Schema({
    userName:{
      type:String,
      required:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
    },
    password:{
        type:String,
        select:false,
        minlength:8,
    },
    role:{
        type:String,
        default:'user'

    },
    isVerified:Boolean,
    verificationToken:String,
    verificationTokenExpiry:Date,
    passwordResetToken : String,
    passwordResetTokenExpiry:Date,
    passwordUpdatedAt:Date
})

const validation = (userObject)=>{
    return userJoiSchema.validate(userObject)
}

const userJoiSchema = joi.object({
    userName: joi.string().alphanum().min(3).max(20).required(),
    password: joi.string().min(8).required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    email:   joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    isGold: joi.boolean
})


userSchema.pre('save' , async function(next){
if(!this.isModified('password')) return next();
  this.password =await  bcrypt.hash(this.password , 12)
  next()
})

userSchema.methods.comparePass = async function(userPass,dbPass){
    return await bcrypt.compare(userPass,dbPass)
}

userSchema.methods.createVerificationToken = function(){
    const buffer =  crypto.randomBytes(32);  
    const verificationToken = buffer.toString('hex');
    this.verificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
    this.verificationTokenExpiry = Date.now() + 24*60 *60*1000;
    this.isVerified = false
    return verificationToken
  }

userSchema.methods.createResetToken =  function(){
    const buffer =  crypto.randomBytes(32);  
    const resetToken = buffer.toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpiry = Date.now() + 10 *60*1000;
    return resetToken
}

function signToken(newUser) {
    return jwt.sign({
        id: newUser._id,
        email: newUser.email
    }, process.env.SECERET_STRING, {
        expiresIn: process.env.JWT_EXPIRY
    })
}


userSchema.methods.isPasswordChanged = function(JwtTimeStamp){
  
    if(this.passwordUpdatedAt){
      const pswrdUpdateTimeStamp = Math.floor(this.passwordUpdatedAt.getTime() /1000)
      if(pswrdUpdateTimeStamp > JwtTimeStamp){
        return true
      }else{
        return false
      }
       
    }
    return false
  }
 
const user = mongoose.model('User',userSchema);
module.exports = {validation , user , signToken}
