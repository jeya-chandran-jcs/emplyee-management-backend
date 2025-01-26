const express=require("express")
const employeeModel=require("../models/employeeModel")
const taskModel=require("../models/taskModel")
const router=express.Router()

router.get("/my-task",async(req,res)=>{
    try{
        const userId=req.user._id
        const tasks=await taskModel.find({userId:userId,status:"pending"})
        if(!tasks){
            return res.status(404).json({message:"No pending tasks found"})
        }
        return res.json(tasks)
    }
    catch(err){
        console.error(err)
        return res.status(401).json({message:"error is server while fetching tasks"}) 
    }
})

router.post("/complete-task",async(req,res)=>{
    const {taskId,completionLink}=req.body
    try{
        const userId=req.user._id
        const task=await taskModel.findById({taskId})
        if(!task || task.assignedTo.toString() !== req.user._id){
            return res.status(404).json({message:"Task not found"})
        }

        const employeeTask=await employeeModel.findOneAndUpadate({
            taskId:taskId,
            userId:userId,
            completionLink,
            status:completed,
            completionDate:Date.now()
        })
        if(!employeeTask){
            return res.status(404).json({message:"Task not found in employee records"})
        }
        return res.status(200).json({message:"Task completed"},employeeTask)
    }
    catch(err){
        console.error(err)
        return res.status(401).json({message:"error is server while completing task"})
    }
})

module.exports=router

