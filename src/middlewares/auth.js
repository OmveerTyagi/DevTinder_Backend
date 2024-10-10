const adminAuth = (req,res,next)=>{
    const token = "xyz"
    const authorizedAdminToken ="yz";
    if(authorizedAdminToken !== token){
        res.status(401).send("You are not admin")
    }
    else{
        next()
    }
}

const userAuth = (req,res,next)=>{
    const token = "xyz"
    const authorizedAdminToken ="xyz";
    if(authorizedAdminToken !== token){
        res.status(401).send("You are not admin")
    }
    else{
        next()
    }
}

module.exports = {adminAuth, userAuth};