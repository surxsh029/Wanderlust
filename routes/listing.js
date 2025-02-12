const express=require("express");

const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js")
const multer=require("multer");
const {storage}=require("../cloudConfing.js")
const upload = multer({storage});

router
 .route("/")
 .get(wrapAsync(listingController.index))
  .post(isLoggedIn,upload.single('listing[image][url]'),validateListing,wrapAsync(listingController.createListing));

//new route
router.get("/new",isLoggedIn,listingController.renderNewForm)
   

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image][url]'),validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing)); 
 


 
 // edit route
 router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListing));


 

 module.exports=router;