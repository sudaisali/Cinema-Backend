const {rental , validation} = require('../models/rental')
const {movie} = require('../models/movie')
const {customer} = require('../models/customer')

const createRental = async (req,res)=>{
    try{
    const {error} = validation(req.body)
    if(error){
      return res.status(422).json({
          message:error.details[0].message
         })
    }
    const getMovie = await movie.findOne({_id:req.body.movie}).select('-__v').exec()
    if(!getMovie){
        return res.status(404).json({
            message : "Sorry No movie Found"
        })
    }
    const getCustomer = await customer.findOne({_id:req.body.customer}).select('-__v').exec()
    if(!getCustomer){
        return res.status(404).json({
            message : "Sorry No Customer Found"
        })
    }
    
    const newRental  = {
        movie:getMovie,
        customer:getCustomer,
        dateOut:Date.now()
    }
    console.log(newRental)
    await rental.create(newRental)
    res.status(200).json({
    status:"success",
    message:"Rental Created successfully"
  })
 
   
    }
    catch(error){
        return res.status(404).json({
            status:"Failed",
            message:error.message   
         })
    }
}

module.exports = {createRental}