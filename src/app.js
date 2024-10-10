const express = require('express');
const app = express();


 app.get ("/user",[(req,res, next)=>{
    console.log("Handle Route 1");
    next()
   // res.send("Response!!");
    // next()
 },
(req,res, next) =>{
    console.log("Handle Route 2");
    next()
    // res.send("Response  2")
},
(req,res, next) =>{
    console.log("Handle Route 3");
    next()
    // res.send("Response  3")
},
(req,res, next) =>{
    console.log("Handle Route 4");
    res.send("Response  4")
}]
)

app.get("/",(req,res)=>{
    res.send("Hello From The Server");
})



app.listen(5117,() =>{
    console.log("Server is running on 5117");
    
})