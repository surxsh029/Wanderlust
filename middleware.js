const Listing=require("./models/listing")
const ExpressError=require("./utils/ExpressError.js")
const {listingSchema}=require("./schema.js");
const {reviewSchema}=require("./schema.js");
const Review=require("./models/review.js")

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        //redirect url
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in before creating listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner = async(req,res,next)=>{
    let {id}=req.params;
     let listing = await Listing.findById(id);
     if(!listing.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error","you are not an owner");
        return res.redirect(`/listings/${id}`);
     };
     next();
}

module.exports.validateListing=(req,res,next)=>{
    let {error}= listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

module.exports.validateReview=(req,res,next)=>{
    console.log("Request Body for Review Validation:", req.body);
    let {error}= reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id,reviewId}=req.params;
     let listing = await Review.findById(id);
     if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error","you did not created this review");
        return res.redirect(`/listings/${id}`);
     };
     next();
}