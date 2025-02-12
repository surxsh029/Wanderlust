const { query } = require("express");
const Listing=require("../models/listing.js")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken= process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings }); 
};


module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
};


module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
   const listing= await Listing.findById(id).populate({path:"reviews",populate:{
       path:"author",
   }}).populate("owner");
   if(!listing){
       req.flash("error","This Listing Doesn't Exist!")
       res.redirect("/listings");
   }
   console.log(listing);
   res.render("listings/show",{listing});
}

module.exports.createListing=async(req,res,next)=>{
   let response =await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit:1,
    })
    .send();
    let url = req.file.path;
    let filename=req.file.filename;
    const newListing= new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={filename,url};
    newListing.geometry= response.body.features[0].geometry;
    let savedListing = await newListing.save();
    console.log(savedListing);

    req.flash("success","New Listing Created")
    res.redirect("/listings");
 }

module.exports.editListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
       req.flash("error","This Listing Doesn't Exist!")
       res.redirect(`/listings`);
   }
    let orignalImageUrl= listing.image.url;
    orignalImageUrl = orignalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit",{listing,orignalImageUrl});
};

module.exports.updateListing=async(req,res)=>{
     let {id}=req.params;
     let listing = await  Listing.findByIdAndUpdate(id,{...req.body.listing});

     if(typeof req.file !== "undefined"){
     let url = req.file.path;
     let filename=req.file.filename;
     listing.image={filename,url};
     await listing.save();
    }
     req.flash("success","Listing Updated Successfully!");
     res.redirect(`/listings/${id}`);
};


module.exports.deleteListing=async(req,res)=>{
    let {id}=req.params;
   await Listing.findByIdAndDelete(id);
   req.flash("success","Listing Deleted Successfully!")
    res.redirect("/listings");
};
