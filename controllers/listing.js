const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const map_token=process.env.MAP_TOKEN
const geocodingClient = mbxGeocoding({ accessToken: map_token });
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    // res.end("working")
    res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let List = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");
    
    if (!List) {
        req.flash("error", "Listing You Requested Does'not Exist!");
        return res.redirect("/listings");
    }else{
        res.render("./listings/show.ejs", { List });
    }
        
    
    
    
};

module.exports.createListing = async (req, res) => {
    
    let coordinate=await geocodingClient.forwardGeocode({
        query:req.body.location+","+req.body.country,
        limit: 1
      })
        .send()
     


    let url=req.file.path;
    let filename=req.file.filename;
    
     
    let { title, category,description, price, location, country } = req.body;
    console.log(location)
    const newListing = new Listing({
        title: title,
        description: description,
        price: price,
        location: location,
        country: country,
        image: { url, filename },
        owner: req.user._id,
        geometry: coordinate.body.features[0].geometry,
        category:category
    });
    let result=newListing.save()
        .then(savedListing => {
            console.log("Listing saved successfully:", savedListing);
            // Handle success if needed
        })
        .catch(error => {
            console.error("Error saving listing:", error);
            // Handle error if needed
        });
    console.log(result)
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let List = await Listing.findById(id);
    
    if (!List) {
        req.flash("error", "Listing You Requested Does'not Exist!");
        return res.redirect("/listings");
    }
    let originalImageUrl=List.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_250,w_300")
    res.render("./listings/edit.ejs", { List,originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    
    if (!req.body.listing) {
        throw new ExpressError(400, "Send Valid data For Listing");
    }
    
    let { id } = req.params;
   
    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    
    if(req.file && typeof req.file!=undefined){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename}
    await listing.save();
    }
    
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
};

module.exports.searchListing=async (req,res)=>{
   
    
      let locationName=req.params.locationname;
      
      let matchingListings = await Listing.find({
        location: { $regex: new RegExp(locationName, "i") }
      });
      if(matchingListings.length>0){
        res.render('./listings/searchListing.ejs', { allListings: matchingListings });
      }else{
        req.flash("error", `Sorry! Currently no listing available at ${locationName}`);
        res.redirect('/listings');
      }
     
  
  }

  module.exports.filterListing=async (req, res) => {
   
        let listingCategory = req.params.filtername;
        let filteredListings = await Listing.find({ category: listingCategory });
        res.render('./listings/filteredListingShow.ejs', { allListings: filteredListings });
    
    }
