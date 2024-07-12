const User=require("../models/user")
module.exports.renderSignupForm=(req,res)=>{
    res.render("./users/signup.ejs")
}


module.exports.signUp=async(req,res)=>{
    try{
       let{username,email,password}=req.body;
       let newUser=new User({username,email})
       let registeredUser=await User.register(newUser,password)
       console.log(registeredUser)
       req.login(registeredUser,(err)=>{
          if(err){
             return next(err)
          }

       req.flash("success","Welcome To Wanderlust!")
       res.redirect("/listings")

       })
      
    } catch(e){
       req.flash("error",e.message)
       res.redirect("/signup")
    }
       
}

module.exports.renderLoginForm=(req,res)=>{
    res.render("./users/login.ejs")
}

module.exports.login=async (req,res)=>{
    req.flash("success","Welcome To WanderLust!,You Are LoggedIn!")
    
    if(res.locals.redirectUrl){
       res.redirect(res.locals.redirectUrl)
    }else{
       res.redirect("/listings")
    }
    
 }

 module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
       if(err){
        return next(err)
       }
       req.flash("success","You Are Logged Out Now")
       res.redirect("/listings")
    })
}