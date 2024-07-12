const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");
main().then((res)=>{
    console.log("Database Connected Sucsessfully")
}).catch((err)=>{
    console.log(err)
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

// insert data to database
let initDb= async ()=>{
   await Listing.deleteMany({});
   initData.data=initData.data.map((obj)=>({
     ...obj,owner:"66876c264a526cd2e12b2e3a"
   }))
   await Listing.insertMany(initData.data);
   console.log("data was initialized")
}
initDb();