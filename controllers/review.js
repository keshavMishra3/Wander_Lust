const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
module.exports.createReview=async (req,res)=>{
      
    let {id}=req.params;
    let listing=await Listing.findById(id);
    let {rating,comment}=req.body;
    let newReview=new Review(req.body.review)
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("new review saved")
    req.flash("success","New Review Created")
    res.redirect(`/listings/${listing._id}`)
}

module.exports.deleteReview=async (req,res)=>{
  
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{id:reviewId}});
    await Review.findByIdAndDelete(reviewId)
    req.flash("success","Review Deleted!")
    res.redirect(`/listings/${id}`)
  }