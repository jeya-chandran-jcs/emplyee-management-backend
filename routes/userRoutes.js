const express=require("express")
const userModel=require("../models/userModel")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const otpNum=require("../helper")
const sendMail=require("../config/mailConfig")
const authentication=require("../middleware/authMiddleware")
const dotenv=require("dotenv")


dotenv.config()
const router=express.Router()


router.post("/register",async(req,res)=>{
    const {email,password}=req.body
    try{
       const isUserExist=await userModel.findOne({email})
       if(isUserExist){
        return res.status(400).json({message:"Email already exist use different one"})
       }
       const hashedPassword=await bcrypt.hash(password,10)

       const newUser=new userModel({...req.body,hashedPassword,role:"admin"})
       console.log(newUser)
       await newUser.save()

       res.status(201).json({message:"user registered successfully"})
    }
    catch(error){
        console.error(error)
        res.status(500).json({error:error.message})
    }
})

router.post("/login",async(req,res)=>{
    const {email,password}=req.body
    try{
        const user=await userModel.findOne({email})
        if(!user){
            return res.status(404).json({message:"user not found please try again"})
        }
        const passwordMatch= await bcrypt.compare(password,user.password)
        if(!passwordMatch){
            return res.status(401).json({message:"password doesnt match please try again"})
        }
        const token=jwt.sign({id:user._id},process.env.JWT,{expiresIn:"1h"})
        console.log(token)
        return res.status(200).json({message:"user successfully logged in",token,user})
    }
    catch(err){
        console.error(err)
        res.status(500).json({error:err.message})
    }
})

router.post("/forgot-password",async(req,res)=>{
    const {email}=req.body
    try{
        const user=await userModel.findOne({email})
        if(!user){
            return res.status(404).json({message:"user not found with this email"})
        }

        const otp=otpNum()

        user.otp=otp
        await user.save()
        const mailOption={
            to:email,
            subject:"Reset Password",
            html:`
            <h1>Reset Password</h1>
            <p>your otp is ${otp}. only valid for 10 minutes </p>
            `,
        }
        await sendMail(mailOption.to,mailOption.subject,mailOption.html)
     
      console.log("mail sent successfully")
       res.status(200).json({message:"otp sent successfully"})

    }
    catch(err){
        console.error(err)
        res.status(500).json({error:err.message})
    }
})

router.post("/reset-password",async(req,res)=>{
    const {otp,password}=req.body
    try{
        const user=await userModel.findOne({otp})
        if(!user){
            return res.status(404).json({message:"sorry its a invalid otp"})
        }
        const hashedPassword=await bcrypt.hash(password,10)
        user.password=hashedPassword
        user.otp=null
        await user.save()
        res.status(200).json({message:"password successfully changed"})

    }
    catch(err){
        console.error(err)
        res.status(500).json({error:err.message})
    }
})

// router.get("/get-employees",authentication,async(req,res)=>{
//     try{
//         const response=await userModel.find()
//         res.status(200).json(response)
//     }
//     catch(err){
//         console.error(err)
//         res.status(500).json({error:err.message})
//     }
// })

module.exports=router
