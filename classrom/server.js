const express= require("express");
const app=express();
const session=require("express-session");
const flash=require("connect-flash");
const path = require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

const sessionOptions={
    secret:"mysupersecretsting",
    resave:false,
    saveUninitialized:true
};

app.use(session(sessionOptions));
app.use(flash());

app.get("/register",(req,res)=>{
    let {name="anonymous"}=req.query;
    req.session.name=name;
    if(name==="anonymous"){
        req.flash("error","user not registered");
    }
    else{
        req.flash("success","user registerd")
    }
   res.redirect("/hello")
})

app.get("/hello",(req,res)=>{
    res.locals.successMsg=req.flash("success")
    res.locals.errorMsg=req.flash("error")
   res.render("page.ejs",{name:req.session.name});
})

// app.get("/test",(req,res)=>{
//     res.send("test succesful")
// })
// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count=1;
//     }
   
//     res.send(`you used this page ${req.session.count} time`)
// })



app.get("/",(req,res)=>{
    res.send("Hello World");
})
app.get("/users",(req,res)=>{
    res.send("Hello from Users");
})
app.get("users/id",(req,res)=>{
    res.send("Hello from User ID");
})
app.post("/users",(req,res)=>{
    res.send("Hello from User Post");
})
app.delete("/users/:id",(req,res)=>{
    res.send("Hello from User Delete");
})

app.listen(3000,()=>{
    console.log("server is running on port 3000")
})

