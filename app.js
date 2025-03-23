if(process.env.CODE_ENV != "production" ){
  require('dotenv').config()
}
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const listingRouter=require("./routes/listing.js")
const reviewRouter=require("./routes/review.js")
const userRouter=require("./routes/user.js")
const session=require("express-session")
const MongoStore = require('connect-mongo');
const flash=require("connect-flash")
const passport=require("passport")
const LocalStrategy = require("passport-local").Strategy;
const Listing=require("./models/listing.js")


const User=require("./models//user.js")
// server setup
// const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust'
// mongoDb setup
const dbUrl=process.env.ATLASDB_URL;
main().then((res)=>{
    console.log("Database Connected Sucsessfully")
}).catch((err)=>{
    console.log("error in connecting database"+ err)
});

async function main() {
  await mongoose.connect(dbUrl);
}
// for using method-override
const methodOverride=require("method-override")
app.use(methodOverride("_method"));
const ExpressError=require("./utils/ExpressError.js")

let path=require("path");
app.set("view engine","ejs")
// for  let {id}=req.params;  extracting data
// for parsing
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({extended:true}));
// require ejs-mate(help for creating template/layout)
const ejsmate=require("ejs-mate");
app.engine("ejs",ejsmate);

// for use static file with views
app.use(express.static(path.join(__dirname,"public")))

const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*60*60
})
store.on("error",()=>{
  console.log("Error In Mongo Session-Store",err)
})
const sessionOptions={
  store:store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() + 7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true
  }
}




app.use(session(sessionOptions))
app.use(flash())


app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// we cant use variables in ejs template
app.use((req,res,next)=>{
  res.locals.success=req.flash("success")
  res.locals.error=req.flash("error")
  res.locals.currUser=req.user;
  next()
})
 

// app.get("/demoUser",async (req,res)=>{
//    let fakeUser=new User({
//     email:"keshav2123",
//     username:"keshav"
//    })
//    let newUser=await User.register(fakeUser,"hello");
//    res.send(newUser)
// })


app.use("/listings",listingRouter)
app.use("/listings/:id/reviews",reviewRouter)
app.use("/",userRouter)


     




app.listen(8080,()=>{
  console.log("server is listening to port 8080 .....")
})


 







//  page not found
app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page Not Found!"))
})
// for handling error
app.use((err,req,res,next)=>{
  let{status=500,message="Something Went Wrong!"}=err;
  res.status(status).render("error.ejs",{message})
  // res.status(status).send(message)
})

