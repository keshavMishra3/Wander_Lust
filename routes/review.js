const express=require("express");
// router object
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/ExpressError.js")
const {reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js")
const {validateListing,validateReview, isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewController = require("../controllers/review.js");

//post route
router.post("/",isLoggedIn,validateReview, wrapAsync(reviewController.createReview))

//for deleting review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview))

module.exports=router