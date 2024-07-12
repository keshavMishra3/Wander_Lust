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
    
     
    
    const { title, description, price, location, country, category } = req.body;
    const newListing = new Listing({
        title:title,
        description:description,
        price:price,
        location:location,
        country:country,
        
        image: { url, filename },
        owner: req.user._id,
        geometry: coordinate.body.features[0].geometry,
        category:category
    });
    
    let savedListing=await newListing.save()
    console.log(savedListing)
    
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
    if (!req.body) {
        throw new ExpressError(400, "Send valid data for listing");
    }

    const { id } = req.params;
    const { title, description, price, location, country, category } = req.body;

    try {
        let listing = await Listing.findById(id);

        if (!listing) {
            throw new ExpressError(404, 'Listing not found');
        }

        listing.title = title;
        listing.description = description;
        listing.price = price;
        listing.location = location;
        listing.country = country;
        listing.category = category;

        if (req.file) {
            listing.image.url = req.file.path;
            listing.image.filename = req.file.filename;
        }

        await listing.save();

        req.flash('success', 'Listing updated successfully!');
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to update listing');
        res.redirect(`/listings/${id}`);
    }
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
