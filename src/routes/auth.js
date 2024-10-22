const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const validator = require("validator");
const {validateSignup} = require("../utils/validator");

authRouter.post("/signup", async(req,res) =>{
    // validation
    validateSignup(req);

    // encryption of password
    const {firstName, lastName, email, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
      
    
   

    // creating an instance
   const user = new User({
       firstName,
       lastName,
       email,
       password:hashedPassword
   });
   try{
      const savedUser = await user.save();
       const token = await user.getJWT()
         
        if(!token){
           return res.status(401).send("Token invalid");
        }
           

           //sending a cookie
           res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 3600000),
          });
      
          res.json({ message: "User Added successfully!", data: savedUser });

   }
   catch (err){
       res.status(400).send("User not Added SuccessFully" + err.message );
        
       
   }  
});

authRouter.post("/login", async(req,res) =>{
   try {
       const {email, password} =req.body;
       if(!validator.isEmail(email)){
           res.send("Invalid email")
       }

       const user = await User.findOne({email:email});
        
       if(!user){
           throw new Error("Invalid crednetials")
       }

       const isPasswordValid = await user.verifyPassword(password);
       if(!isPasswordValid){
           throw new Error("Invalid Credentials")
       }
       else{
           //creating a JWT
           const token = await user.getJWT()
        
        if(!token){
           return res.status(401).send("Token invalid");
        }
           

           //sending a cookie
           res.cookie("token",token);


           res.send(user);
       }
       
       
   } catch (err) {
       res.status(404).send("invalid credentials" + err.message );
       
   }
});

authRouter.post("/logout",async(req,res) =>{
    try {
        res.cookie("token",null,{expires: new Date( Date.now())});
        res.send("Logged out Successfully");
    } catch (error) {
        res.status(404).send("Something Went Wrong!!!  Try Again");
    }
})
module.exports = authRouter;