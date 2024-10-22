const mongoose = require("mongoose");


const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.SchemaTypes.ObjectId,
        required :true,
        ref: "User"
    },
    toUserId:{
        type: mongoose.SchemaTypes.ObjectId,
        ref:"User",
        required :true
    },
    status:{
        type:String,
        required :true,
        enum:{
            values : ["accepted", "rejected","ignored", "interested"],
            message : `{VALUE}is not valid`
        }
    }
},
{timestamps:true});


connectionRequestSchema.pre("save",function(next){
    const connectionRequest = this;

    if (!connectionRequest.fromUserId || !connectionRequest.toUserId) {
        return next(new Error("User IDs must be provided"));
    }

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Can not send Request to yourSelf");
    }
    next();
})

connectionRequestSchema.index({fromUserId: 1, toUserId :1});

const ConnectionRequest = mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema
  );
  module.exports = ConnectionRequest;