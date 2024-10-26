const express = require('express');
const app = express(); 
const connectDB =require("./src/config/database");
const User = require("./src/models/user");
const { ReturnDocument } = require('mongodb');
const {validateSignup } = require("./src/utils/validator");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const JWT = require("jsonwebtoken");
const { userAuth } = require('./src/middlewares/auth');
const authRouter = require("./src/routes/auth");
const profileRouter = require("./src/routes/profile");
const requestRouter = require("./src/routes/request");
const userRouter = require("./src/routes/user");
const cors = require("cors");
app.use(cors({
  origin:"https://chillmates.netlify.app",
  credentials:true
}));
app.use(express.json());
app.use(cookieParser());


app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);

app.post("/sendConnectionRequest",userAuth, (req,res,next) =>{
    try {
        const {firstName} =req.user;
        res.send(firstName + " is sending connection request to you");
    } catch (error) {
        res.status.apply(404).send("connection request not send " + error.message);
    }
})

app.delete("/deleteUserById",async(req,res) =>{

    const id = req.body._id;
    
    try{
        await User.findByIdAndDelete({ _id:id});
        res.send("User Successfully deleted from the database");


    }
    catch (err){
        res.status(400).send("Something went wrong" );
        console.log(err.message);
        
    }
});


 


app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;
    try {
      const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
      const isUpdateAllowed = Object.keys(data).every((k) =>
        ALLOWED_UPDATES.includes(k)
      );
      if (!isUpdateAllowed) {
        throw new Error("Update not allowed");
      }
      if (data?.skills.length > 10) {
        throw new Error("Skills cannot be more than 10");
      }
      const user = await User.findByIdAndUpdate({ _id: userId }, data, {
        returnDocument: "after",
        runValidators: true,
      });
       
      res.send("User updated successfully");
    } catch (err) {
      res.status(400).send("UPDATE FAILED:" + err.message);
    }
  });




app.get("/",(req,res)=>{
    res.send("Hello From The Server");
})

connectDB().then(
    () =>{
        console.log("Database connection established");

        app.listen(5117,() =>{
            console.log("Server is running on 5117");
            
        });
        
    }
)
.catch((err)=>{
    console.log("Database can not be connected");
    
})

