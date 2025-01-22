const express= require("express");
const app = express();
const mongoose=require("mongoose");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js")
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const session=require("express-session");
const flash=require("connect-flash");

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
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
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookies:{
        expires:Date().now + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    }

}

app.get("/",(req,res)=>{
    res.send("root is working");
})
app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error")
    next();
})

app.use("/listings",listings)
app.use("/listings/:id/reviews",reviews)




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