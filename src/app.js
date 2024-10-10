const express = require('express');
const app = express();
const {adminAuth, userAuth} = require("./middlewares/auth");

app.use("/admin",adminAuth)


app.get("/admin/getAllUser", (req,res) =>{
        res.send("Get All User data");
});

app.delete("/admin/deleteUser", (req,res) =>{
        res.send("User data Deleted");  
})

app.get("/user/data",userAuth,(req,res) =>{
    res.send("User data");
})

app.get("/user/login",(req,res) =>{
    res.send("User Login");
})

app.get("/",(req,res)=>{
    res.send("Hello From The Server");
})



app.listen(5117,() =>{
    console.log("Server is running on 5117");
    
})