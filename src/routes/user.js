const express = require("express");
const userRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user")



userRouter.get("/user/requests/received",userAuth,async (req,res) =>{
    try {
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId",["firstName","lastName","age","gender","photoUrl"]);
        if(!connectionRequest){
            return res.status(404).send("No connection request received");
        };

        res.json({
            message:"connection requests received successfully",
            data: connectionRequest
        })

    } catch (error) {
        
    }
})

userRouter.get("/user/connection",userAuth,async(req,res) =>{
    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id,status:"accepted"},
                {fromUserId:loggedInUser._id,status:"accepted"}
            ]
        }).populate("fromUserId",["firstName","lastName","age","gender","photoUrl"]).populate("toUserId",["firstName","lastName","age","gender","photoUrl"])


        const data = connectionRequest.map((row) =>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        })

        res.json({data});


         


    } catch (error) {
        res.status(404).send("Error : "+ error.message);
    }
})

userRouter.get("/feed",userAuth,async(req,res) =>{
    try {
        const loggedInUser = req.user;
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const skip = (page-1)*limit;
         

        const connectionRequest = await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id},{fromUserId:loggedInUser._id}
            ]
        }).select("fromUserId toUserId");
         
        

        const hideUserFromFeed = new Set();
        connectionRequest.forEach((req) =>{
            hideUserFromFeed.add(req.toUserId.toString());
            hideUserFromFeed.add(req.fromUserId.toString());
        });

        const users = await User.find({
            $and:[
                {_id: {$nin: Array.from(hideUserFromFeed)}},
                {_id: {$ne : loggedInUser._id}}
            ]
        }).skip(skip).limit(limit);
        res.json(users)
        
    } catch (error) {
        res.status(404).send("Error " +error.message);
    }
})


module.exports = userRouter;