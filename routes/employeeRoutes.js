const express=require("express")
const employeeModel=require("../models/employeeModel")
const taskModel=require("../models/taskModel")
const authentication=require("../middleware/authMiddleware")
const userModel = require("../models/userModel")

const router=express.Router()

router.get("/my-task",authentication,async(req,res)=>{
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

router.post("/complete-task",authentication,async(req,res)=>{
    const {taskId,completionLink}=req.body
    try{
        const userId=req.user.id
        const task=await taskModel.findById(taskId)
        console.log("task",task)
        console.log("task string",task.assignedTo.toString())
        if(!task){
            return res.status(404).json({message:"No task found"})
        }
        // if(task.assignedTo.toString() !== userId.toString()){
        //     return res.status(404).json({message:"Task not found"})
        // }

        // const employeeTask=await employeeModel.findOneAndUpdate(
        //     {taskId:task._id,userId:userId },
        //     {completionLink,status:"completed",completionDate:Date.now() },
        //     {new:true}
        // )
        let employeeTask= await employeeModel.findOne({taskId:task._id,userId})
        if(!employeeTask){
            employeeTask = new employeeModel({
                userId,
                taskId:task._id,
                completionLink,
                status:"completed",
                completionDate:Date.now()
            })
            await employeeTask.save()
        }
        else{
            employeeTask = await employeeModel.findOneAndUpdate(
                { userId, taskId: task._id },
                { completionLink, status: "completed", completionDate: Date.now() },
                { new: true }
            );
        }
        await taskModel.findByIdAndUpdate(task._id, { status: "completed" });
        return res.status(200).json({message:"Task completed",employeeTask})
    }
    catch(err){
        console.error(err)
        return res.status(401).json({message:"error is server while completing task"})
    }
})

router.get("/profile",authentication,async(req,res)=>{
    try{
        const userId=req.user.id
        console.log(userId)
        const employee=await userModel.findById(userId)
        if(!employee){
            return res.status(404).json({message:"Employee not found"})
        }
        return res.json(employee)
    }
    catch(err){
        console.error(err)
        return res.status(401).json({message:"error is server while fetching employee profile"}) 
    }
})

module.exports=router

