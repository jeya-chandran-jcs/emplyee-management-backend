const nodemailer=require("nodemailer")
const dotenv=require("dotenv")
dotenv.config()

const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASS
    }
})

const sendMail=async(to,subject,html)=>{
    try{
        const mailOption={
            from:process.env.EMAIL,
            to,
            subject,
            html
        }
        await transporter.sendMail(mailOption)
        console.log("email sent successfully")
    }
    catch(err){
        console.error("could not send email",err)
    }
}

module.exports=sendMail