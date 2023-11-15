const {genera , validation} = require('../models/genera')


const createGenera = async (req,res)=>{
try{
    const {error} = validation(req.body)
    if (error) {
        return res.status(422).json({message:error.details[0].message})
     }
      
     await genera.create(req.body)
     return res.status(200).json({
        status:"success",
        message:"genera Created Successfully"
     })
  } catch (error) {
     return res.status(409).json({
        status:"Failed",
        message:error.message
        
     })
  }



}

module.exports = {createGenera}