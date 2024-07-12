const express=require("express");
const router=express.Router();
const Listing=require("./models/listing.js")
const ExpressError=require("./utils/ExpressError.js")
const {listingSchema}=require("./schema.js");
const {reviewSchema}=require("./schema.js");
const Review=require("./models/review.js")
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
      // redirectUrl
        // console.log(req.originalUrl)
        req.session.redirectUrl=req.originalUrl;
        // console.log(req.session.redirectUrl)
        req.flash("error","You Must Be LoggedIn To Create Listing");
        return res.redirect("/login")
      }
      next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
   if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
    // console.log(res.locals.redirectUrl)
   }
   next();
}
module.exports.isOwner=async (req,res,next)=>{
  let {id}=req.params;
  let listing=await Listing.findById(id)
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","You Don't Have Permission To Edit")
    res.redirect(`/listings/${id}`)
   }
   next();
}

module.exports.isReviewAuthor=async (req,res,next)=>{
  let {id,reviewId}=req.params;
  let review=await Review.findById(reviewId)
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","You Don't Have Permission To Delete")
    res.redirect(`/listings/${id}`)
   }else{
    next();
   }
   
}

module.exports.validateListing=(req,res,next)=>{
  let {error}=listingSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",")
    throw new ExpressError(400,errMsg)
  }else{
    next();
  }
};


module.exports.validateReview=(req,res,next)=>{
  let {error}=reviewSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",")
    throw new ExpressError(400,errMsg)
  }else{
    next();
  }
};