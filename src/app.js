const express = require('express');
const app = express();

app.get("/",(req,res)=>{
    res.send("Hello From The Server");
})

app.listen(5117,() =>{
    console.log("Server is running on 5117");
    
})