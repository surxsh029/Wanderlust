const User=require("../models/user");

module.exports.singnupForm=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser =new User({email,username});
        const registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
              return  next(err);
            }
            req.flash("success","Welcome to wanderlust!")
            res.redirect("/listings");
        })
       
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup")
    }
};
module.exports.login=(req,res)=>{
    res.render("users/login.ejs")
};

module.exports.loginForm=async(req,res)=>{
    req.flash("success","welcome back to Wanderlust");
    let redirectUrl=res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","logged you out!");
        res.redirect("/listings");
    });
};