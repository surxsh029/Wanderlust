const express=require("express");

const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js")
const {listingSchema}=require("../schema.js");

//validate function
const validateListing=(req,res,next)=>{
    let {error}= listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
    }else{
        next();
    }
    };

//index route
router.get("/",wrapAsync(async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings }); 
 }));
 //new route
 
 router.get("/new",(req,res)=>{
     res.render("listings/new");
 })
 
 //show route
 router.get("/:id",wrapAsync(async (req,res)=>{
     let {id}=req.params;
    const listing= await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","This Listing Doesn't Exist!")
        res.redirect("/listings");
    }
    res.render("listings/show",{listing});
 }));
 
 //create route
 router.post("/",validateListing,wrapAsync(async(req,res,next)=>{
    const newListing= new Listing(req.body.listing);
    await newListing.save();
    req.flash("success","New Listing Created")
    res.redirect("/listings");
 }));
 
 // edit route
 router.get("/:id/edit",wrapAsync(async(req,res)=>{
     let {id}=req.params;
     const listing=await Listing.findById(id);
     if(!listing){
        req.flash("error","This Listing Doesn't Exist!")
        res.redirect("/listings");
    }
     res.render("listings/edit",{listing});
 }));
 //update route
 router.put("/:id",validateListing,wrapAsync(async(req,res)=>{
     let {id}=req.params;
      await  Listing.findByIdAndUpdate(id,{...req.body.listing});
      req.flash("success","Listing Updated Successfully!");
     res.redirect("/listings");
 }));
 
 //delete route
 router.delete("/:id",wrapAsync(async(req,res)=>{
     let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted Successfully!")
     res.redirect("/listings");
 }));

 module.exports=router;