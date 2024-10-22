const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const {validateProfileEditData} = require("../utils/validator");
const bcrypt = require("bcryptjs");
 
profileRouter.get("/profile/view",userAuth, async(req,res,next) =>{
    try {
         const user = req.user
        res.send(user);
        
        
    } catch (error) {
        res.status(401).send("invalid credentials" + err.message );
    }
});

profileRouter.patch("/profile/edit",userAuth, async(req,res) =>{
    try {
        if(!validateProfileEditData){
            throw new Error("data can not be editted");
        }

        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) =>(loggedInUser[key] = req.body[key]));

        await loggedInUser.save();

        res.send(loggedInUser)
       
    } catch (error) {
        res.status(405).send("Some Error Occured with Editing the Profile");
        
    }
 
})


profileRouter.post("/profile/resetPassword",userAuth, async(req,res) =>{
    try {
        const {oldPassword, newPassword, confirmNewPassword} = req.body;
        const user = req.user;
        const hashedPassword = user.password;

        const matchPassword = await bcrypt.compare(oldPassword,hashedPassword);
        if(!matchPassword){
            throw new Error("Old password is incorrect");
        }
        if(newPassword === oldPassword){
            throw new Error("Your old password cant be your new password");
        }
        else if(newPassword !== confirmNewPassword){
            throw new Error("new password and confirm new password does not match ");
        }
        const newHashedPassword =await bcrypt.hash(newPassword,10);
         

        user.password = newHashedPassword;
        await user.save();

        res.cookie("token",null,{expires: new Date(Date.now())});


        res.send("Password successfully changed Please login again");

        
    } catch (error) {
        res.status(404).send("Error : "+error.message);
        
    }
})



module.exports = profileRouter;