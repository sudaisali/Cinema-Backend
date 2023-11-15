const {customer , validation} = require('../models/customer')


const createCustomer = async (req,res)=>{

    const {error} = validation(req.body)
    if (error) {
        return res.status(422).json({message:error.details[0].message})
     }
      const newUser = {
         ...req.body,
         }
   try{
     await customer.create(newUser)
     return res.status(200).send({
        status:"success",
        message:"Customer Created Successfully"
     })
  } catch (error) {
     return res.status(409).send({
        status:"Failed",
        message:error.message
        
     })
  }



}

module.exports = {createCustomer}