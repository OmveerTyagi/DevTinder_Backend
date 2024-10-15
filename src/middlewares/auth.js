const JWT = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async(req,res,next)=>{
    

    try{
        const {token} = req.cookies;
        if(!token){
        throw new Error("Invalid Token")
    }
    const decodedMessage = await JWT.verify(token,"ABCD1234",{expiresIn:"1h"});
    const {_id} = decodedMessage;
    const user = await User.findOne({_id});
    if(!user){
        throw new Error("User is Not for")
        
    }
    req.user = user;
        next();
}
    catch (error){
        res.status(404).send("Error Occured " +error.message);
    }
}

module.exports = {  userAuth};