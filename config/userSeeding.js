const mongoose=require("mongoose")
const userModel=require("../models/userModel")
const dotenv=require("dotenv")
const bcrypt=require("bcryptjs")

dotenv.config()
const mongoUrl=process.env.MONGO_URL

  const seedUsers=async()=>{
    try{
        const userCount=await userModel.countDocuments()
        if(userCount===0){
            console.log(`no data found seedind database`)
 
            const users = await Promise.all([
                { name: "John Doe", email: "johndoe@example.com", password: await bcrypt.hash("password123",10), department: "HR" },
                { name: "Jane Smith", email: "janesmith@example.com", password: await bcrypt.hash("password123",10), department: "Finance" },
                { name: "Alice Johnson", email: "alicejohnson@example.com", password: await bcrypt.hash("password123",10), department: "Engineering" },
                { name: "Bob Brown", email: "bobbrown@example.com", password: await bcrypt.hash("password123",10), department: "Sales" },
                { name: "Charlie Davis", email: "charliedavis@example.com", password: await bcrypt.hash("password123",10), department: "Marketing" },
                { name: "Admin One", email: "admin1@example.com", password:await bcrypt.hash("admin123",10), role: "admin", department: "Management" },
                { name: "Admin Two", email: "admin2@example.com", password: await bcrypt.hash("admin123",10), role: "admin", department: "Management" }
        ])

            await userModel.insertMany(users)
            console.log(`database seeded completed ${userCount}`)
        }
        else{
            console.log(`database already seeded with ${userCount} records`)
        }
    }
    catch(err){
        console.error("couldnot perform seeding ",err)
    }
  }

  module.exports=seedUsers