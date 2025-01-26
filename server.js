const express=require("express")
const dotenv=require("dotenv")
const mongoose=require("mongoose")
const cors=require("cors")
const seedUsers = require("./config/userSeeding")
const userRoutes=require("./routes/userRoutes")
const taskRoutes=require("./routes/taskRoutes")

dotenv.config()
const app=express()
app.use(express.json())
app.use(cors())

const PORT=process.env.PORT || 8000
const mongoUrl=process.env.MONGO_URL
console.log(PORT,">>>")

app.get("/",(req,res)=>{
    res.send("hello world")
})

app.use("/user",userRoutes)
app.use("/task",taskRoutes)

mongoose.connect(mongoUrl)
  .then(async() => {
        console.log("mongodb is connected")

        await seedUsers()
        .then(()=>{
            console.log("user seeded successfully")
        }).catch(err=>{
            console.log("Seeding failed",err)
        })

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error in server connectivity", err);
  });

