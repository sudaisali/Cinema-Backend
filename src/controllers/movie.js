const {movie , validation} = require('../models/movie')
const {genera} = require('../models/genera')

const createMovie = async (req,res)=>{
  try{  
  const {error} = validation(req.body)
  if(error){
   return res.status(200).json({
    message:error.details[0].message
   })
  }
  const getGenera = await genera.findOne({_id:req.body.genera}).select('-__v').exec()
  if(!getGenera){
    return res.status(400).json({
      message:"Sorry Genera Does Not exist"
    })
  }
  const newMovie = {
    ...req.body,
    genera : getGenera
  }
  await movie.create(newMovie)
  res.status(200).json({
    status:"success",
    message:"Movie Added successfully"
  })
}
catch (error) {
  return res.status(409).json({
     status:"Failed",
     message:error.message
     
  })
}

}


module.exports = {createMovie}