const mongoose = require("mongoose");
const validator = require('validator');
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
    firstName:{
        type: String,
        trim:true,
        required : true 
    },
    middleName:{
        type: String
    },
    lastName:{
        type: String,
        required : true
    },
    email:{
        type: String,
        required : true,
        unique:true,
        lowercase:true,
        trim:true,
         validate(value){
            if(!validator.isEmail(value)){
                throw new  Error("Invalid Email Address " + value);
            }
         }
    },
    password:{
        type: String,
        required : true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password" + value);
            }
        }
    },
    age:{
        type: Number ,
        min:18
        // required : true
    },
    gender:{
        type: String ,
        validate(value){
            if(!["Male","Female","Others"].includes(value)){
                throw new Error("Gender data is not valid");
            }
        }
    },
    about:{
        type:String,
        default:"This is Short description About user"
    },
    skills:{
        type:[String]
    },
    photoUrl:{
        type:String,
        default: "https://geographyandyou.com/images/user-profile.png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("PhotoUrl is not valid" + value);
            }
        }
    }
     
},
{
    timestamps:true,
});

userSchema.index({firstName:1,lastName:1});

userSchema.methods.getJWT = function(){
    const token = JWT.sign({_id : this._id}, "ABCD1234");

    return token
}

userSchema.methods.verifyPassword = async function(password){
    const user = this;
    
    const validPassord =await bcrypt.compare(password, user.password);
    return validPassord;
}


module.exports = mongoose.model("User", userSchema);