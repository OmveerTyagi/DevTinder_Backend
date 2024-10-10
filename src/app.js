const express = require('express');
const app = express();


app.get("/ab*c",(req,res)=>{
        res.send("ABC route");
    })
    
    // // app.get("/.*fly$",(req,res)=>{
    // //     res.send("ABC route");
    // // })

app.get("/user/:id",(req ,res)=>{
    console.log(req.params)
    res.send("User is Found")
    console.log("User is Found");
    
})

app.post("/user",(req ,res)=>{
    res.send("User Data is Send")
    console.log("User data is Send");
    
})

app.patch("/user",(req ,res)=>{
    res.send("User Data is Successsfully Updated")
    console.log("User Data is Successsfully Updated");
    
})

app.delete("/user",(req ,res)=>{
    res.send("User is successfully deleted")
    console.log("User is successfully deleted");
    
})


app.get("/hello/2",(req,res)=>{
    res.send("Hello 2");
})

app.get("/hello/api/2",(req,res)=>{
    res.send("Hello !");
})

app.get("/hello",(req,res)=>{
    res.send("Hello  ");
})

app.use("/get",(req,res)=>{
    res.send("Hello World!");
})

app.get("/",(req,res)=>{
    res.send("Hello From The Server");
})



app.listen(5117,() =>{
    console.log("Server is running on 5117");
    
})