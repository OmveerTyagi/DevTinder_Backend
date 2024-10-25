const mongoose = require("mongoose");

 
 
const connectDB = async ()=>{
   await mongoose.connect("mongodb+srv://omveertyagi544437:qcYJQ1m2H8OpVVrz@namastenode.wzs5k.mongodb.net/devTinder");
}




module.exports =connectDB;