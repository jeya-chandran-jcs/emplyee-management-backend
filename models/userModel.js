const mongoose=require("mongoose")


const userSchema=mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    otp:{type:Number},
    role:{type:String,enum:["employee", "admin"],default:"employee"},
    department:{type:String},
    createdAt:{type:Date,default:Date.now()},
    updatedAt:{type:Date,default:Date.now()},

})

const userModel=mongoose.model("user",userSchema)

module.exports=userModel;