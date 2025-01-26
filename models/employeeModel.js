const mongoose=require("mongoose")

const employeeSchema=mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"user"},
    taskId:{type:mongoose.Schema.Types.ObjectId,ref:"task"},
    completionLink:{type:String},
    status:{type:String,enum:["pending","completed"],default:"pending"},
    completionDate:{type:Date},
    createdAt:{type:Date,default:Date.now()}
})

const employeeModel=mongoose.model("employee",employeeSchema)

module.exports=employeeModel