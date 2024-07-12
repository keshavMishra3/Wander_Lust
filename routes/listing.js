const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const{storage}=require("../cloudConfig.js")
const upload = multer({ storage})
router.route("/")
  // Index route for showing all listing data
  .get(wrapAsync(listingController.index))
  // Create route for new listing
  .post(isLoggedIn,upload.single("image"),validateListing,wrapAsync(listingController.createListing));
  // show listing on the basis of search upload.single("listing[image]")
  router.get("/search/location/:locationname",wrapAsync(listingController.searchListing))
  // show listing on based of filter
  router.get("/search/:filtername", wrapAsync(listingController.filterListing));

// New route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
  // Show route: showing all data of a particular listing
  .get(wrapAsync(listingController.showListing))
  // Update route
  .put(isLoggedIn, isOwner,upload.single("image"),validateListing, wrapAsync(listingController.updateListing))
  // Destroy route
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

// Edit Route
router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.renderEditForm));




module.exports = router;

