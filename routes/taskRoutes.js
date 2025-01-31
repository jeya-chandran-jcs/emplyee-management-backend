const express=require("express")
const taskMoel=require("../models/taskModel")
const {adminMid}=require("../middleware/adminMiddleware")
const authentication=require("../middleware/authMiddleware")
const employeeModel = require("../models/employeeModel")
const userModel=require("../models/userModel")

const router=express.Router()

router.post("/assign-task",authentication,adminMid,async(req,res)=>{
    const {title,description,department,dueDate,assignedTo}=req.body
    try{
        const task=new taskMoel({
            title,
            description,
            department,
            dueDate:dueDate ||  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            assignedTo})
        await task.save()
     
    //  const employeeTask=await employeeModel({
    //      userId:assignedTo,
    //      taskId:task._id,
    //      status:"pending"
    // //  })
    //  await employeeTask.save()
        return res.status(201).json(task)
    }
    catch(err){
        console.error(err)
        return res.status(500).json({message:"Server error"})
    }
})

router.get("/status",authentication,adminMid,async(req,res)=>{
    try{
        const employees=await employeeModel.find().populate({
            path:"userId",
            select:"status",
            select:"name",
        })
        .populate({
            path:"taskId",
            select:"title"
        })
        console.log(employees)
        
        const statusData = employees.map(emp => ({
            name: emp.userId?.name || "Unknown",
            taskTitle: emp.taskId?.title || "No task",
            status: emp.status,
            completionLink: emp.completionLink || "Not provided",
            completionDate: emp.completionDate || "Not provided"
        }));
        return res.status(200).json(statusData)
    
    }
    catch(err){
        console.error(err)
        return res.status(500).json({message:"Server error"})
    }
})


router.get("/all-employees",authentication,adminMid,async(req,res)=>{
    try{
        const employees=await userModel.find()
        return res.status(200).json(employees)
    }
    catch(err){
        console.error(err)
        return res.status(500).json({message:"Server error"})
    }
})
module.exports=router