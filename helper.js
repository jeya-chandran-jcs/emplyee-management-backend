const otpNum=()=>{
    const otp=Math.floor(Math.random()*(1000000-100000))
    return otp
}

module.exports=otpNum;