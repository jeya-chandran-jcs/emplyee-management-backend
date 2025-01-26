const jwt=require("jsonwebtoken")
const dotenv=require("dotenv")

dotenv.config()

function authentication(req,res,next){
    const authHeader=req.headers.authorization

    if(!authHeader){
        return res.status(401).json({message:"Token not provided"})
    }
    let token
    if(authHeader.startsWith("Bearer ")){
        token=authHeader.split(" ")[1]
    }
    else{
        token=authHeader
    }
    console.log("token",token)
    try{
        const decoded=jwt.verify(token,process.env.JWT)
        req.user=decoded
        console.log(req.user)
        next()
    }
    catch(err){
        console.error(err)
        return res.status(403).json({message:"Token is not valid"})
    }
}

module.exports=authentication