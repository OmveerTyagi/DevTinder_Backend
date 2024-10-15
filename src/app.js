const express = require('express');
const app = express(); 
const connectDB =require("./config/database");
const User = require("./models/user");
const { ReturnDocument } = require('mongodb');
const {validateSignup } = require("./utils/validator");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const JWT = require("jsonwebtoken");
const { userAuth } = require('./middlewares/auth');

app.use(express.json());
app.use(cookieParser());

 
app.post("/signup", async(req,res) =>{
     // validation
     validateSignup(req);

     // encryption of password
     const {firstName, lastName, email, password} = req.body;
     const hashedPassword = await bcrypt.hash(password, 10);
    //  console.log("hashed Password" +hashedPassword);
     
    

     // creating an instance
    const user = new User({
        firstName,
        lastName,
        email,
        password:hashedPassword
    });
    try{
        await user.save();
    res.send("User Added successfully");

    }
    catch (err){
        res.status(400).send("User not Added SuccessFully" + err.message );
        // console.log();
        
    }  
});

app.post("/login", async(req,res) =>{
    try {
        const {email, password} =req.body;
        if(!validator.isEmail(email)){
            res.send("Invalid email")
        }

        const user = await User.findOne({email:email});
        // console.log(user);
        if(!user){
            throw new Error("Invalid crednetials")
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            throw new Error("Invalid Credentials")
        }
        else{
            //creating a JWT
            const token = JWT.sign({_id : user._id}, "ABCD1234");
            console.log(token);
            

            //sending a cookie
            res.cookie("token",token);


            res.send("Login Successful");
        }
        
        
    } catch (err) {
        res.status(400).send("invalid credentials" + err.message );
        
    }
})

app.get("/profile",userAuth, async(req,res,next) =>{
    try {
         const user = req.user
        res.send(user);
        
        
    } catch (error) {
        res.status(400).send("invalid credentials" + err.message );
    }
})

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
     console.log(id);
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
      console.log(user);
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

