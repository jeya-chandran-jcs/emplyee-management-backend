const mongoose=require("mongoose")

const taskSchema=mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    department:{type:String},
    status:{type:String,enum:["pending","completed"],default:"pending"},
    dueDate:{type:Date},
    assignedTo:{type:mongoose.Schema.Types.ObjectId,ref:'user',required:true},
    createdAt:{type:Date,default:Date.now()}
})

const taskModel=mongoose.model("task",taskSchema)

module.exports=taskModel