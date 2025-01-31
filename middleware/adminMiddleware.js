const authentication=require("./authMiddleware")


const adminMid=(req,res,next)=>{
    console.log("user in adminmid", req.user.role)
    if(!req.user){
        return res.status(401).json({message:"Token not provided"})
    }

    if(req.user.role==="admin"){
        next()
    }
    else{
        res.status(403).json({message:"Access denied only admin can access this"})
    }
}

module.exports={authentication,adminMid}