const express=require("express");

const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");

//validate function


//index route
router.get("/",wrapAsync(async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings }); 
 }));
 //new route
 
 router.get("/new",isLoggedIn,(req,res)=>{
        res.render("listings/new.ejs");
 })
 
 //show route
 router.get("/:id",wrapAsync(async (req,res)=>{
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
 }));
 
 //create route
 router.post("/",isLoggedIn,validateListing,wrapAsync(async(req,res,next)=>{
    const newListing= new Listing(req.body.listing);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created")
    res.redirect("/listings");
 }));
 
 // edit route
 router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
     let {id}=req.params;
     const listing=await Listing.findById(id);
     if(!listing){
        req.flash("error","This Listing Doesn't Exist!")
        res.redirect(`/listings`);
    }
     res.render("listings/edit",{listing});
 }));
 //update route
 router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(async(req,res)=>{
     let {id}=req.params;
     await  Listing.findByIdAndUpdate(id,{...req.body.listing});
     req.flash("success","Listing Updated Successfully!");
     res.redirect("/listings");
 }));
 
 //delete route
 router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
     let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted Successfully!")
     res.redirect("/listings");
 }));

 module.exports=router;