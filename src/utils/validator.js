const validator = require("validator");

const validateSignup = (req) =>{
    const {firstName,lastName, password, email} =req.body;

    if(!firstName || !lastName || !password || !email){
        throw new Error("All field are required");
    }

    if(firstName.length < 3 || firstName.length > 60){
        throw new Error("FirstName can be minimum 3 characters and maximum 60 characters")
    }
    if(lastName.length < 3 || lastName.length > 60){
        throw new Error("LastName can be minimum 3 characters and maximum 60 characters")
    }
    if(!validator.isEmail(email)){
        throw new Error("invalid email address");
    }
    if(!validator.isStrongPassword(password)){
        throw new Error("Write a strong Password");
    }


}

const validateProfileEditData = (req)=>{
    const isAllowedEdit = ["firstName","lastName","gender","age","skills","photoUrl","about"];

    const isEditAllowed = Object.keys(req.body).every((field) => isAllowedEdit.includes(field));

    return isEditAllowed;
}

module.exports = {
    validateSignup,
    validateProfileEditData
};