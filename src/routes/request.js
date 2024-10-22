const express = require("express");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const {userAuth} = require("../middlewares/auth");

requestRouter.post("/request/send/:status/:userId",userAuth,async(req,res ) =>{
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.userId;
        const status = req.params.status;
         
        const isAllowedStatus = ["ignored", "interested"];

        if(!isAllowedStatus.includes(status)){
            res.send(`${status} is not good`)
        }

        const checkUser = await User.findById(toUserId);
        if(!checkUser){
           return res.send("user is not present in database");
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
              { fromUserId, toUserId },
              { fromUserId: toUserId, toUserId: fromUserId },
            ],
          });
          if (existingConnectionRequest) {
            return res
              .status(400)
              .send({ message: "Connection Request Already Exists!!" });
          }
        

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })
        const data = await connectionRequest.save();

    

        res.json({
            message:"Connection request sent successfully",
            data,
            
        })
        
    } catch (error) {
        res.status(400).send("Error : "+ error.message)
    }
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async(req,res) =>{
    try {
        const {status,requestId} = req.params;

        const isAllowedStatus = ["accepted", "rejected"];

        if(!isAllowedStatus.includes(status)){
            return res.status(400).json({
                message:"Status not allowed"
            })
        };
        const user = req.user;
        const loggedInUser = user;

        const connectionRequest = await ConnectionRequest.findOne({
            _id:requestId,
            toUserId:loggedInUser._id,
            status:"interested"
        })
          
        if(!connectionRequest){
            return res.status(404).send("User not Found");
        }

         connectionRequest.status =  status;

         const data = await connectionRequest.save();


        res.json({
            message:`${status} Successfully`,
            data
        })
        
    } catch (error) {
        res.status(404).send("Error Occured : " + error.message);
        
    }
})

module.exports = requestRouter;