const Joi = require('joi');

module.exports.listingSchema = Joi.object({
  
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(100),
    category: Joi.string().valid(
      'trending', 'rooms', 'iconic-cities', 'mountains', 
      'castles', 'amazing-pools', 'camping', 'farms', 'arctic'
    ).required()
  
});







module.exports.reviewSchema=Joi.object({
  review : Joi.object({
    comment:Joi.string().required(),
    rating:Joi.number().required().min(1).max(5),
   
  }).required()
 })
    

