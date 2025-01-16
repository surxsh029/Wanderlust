const express= require("express");
const app = express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js")
const {listingSchema}=require("./schema.js");

const path=require("path");

const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';

main().then(()=>{
    console.log("connected to db");

}).catch(err=>console.log(err));
async function main() {
  await mongoose.connect(MONGO_URL);
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


app.get("/",(req,res)=>{
    res.send("root is working");
})

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
app.get("/listings",wrapAsync(async(req,res)=>{
   const allListings = await Listing.find({});
   res.render("listings/index", { allListings }); 
}));
//new route

app.get("/listings/new",(req,res)=>{
    res.render("listings/new");
})

//show route
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
   const listing= await Listing.findById(id);
   res.render("listings/show",{listing});
}));

//create route
app.post("/listings",validateListing,wrapAsync(async(req,res,next)=>{
   const newListing= new Listing(req.body.listing);
   await newListing.save();
   res.redirect("/listings");
}));

// edit route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit",{listing});
}));
//update route
app.put("/listings/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;
     await  Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings");
}));

//delete route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
   await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not Found"));
})

app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went Wrong"}=err;
    res.status(statusCode).render("./listings/error",{message});
})

app.listen(8080,()=>{
    console.log("server is running on port 8080");
})