const jwt = require("jsonwebtoken");

const forgetPasswordToken = async(payload)=>{
    try {
        return await jwt.sign({payload},process.env.SECRETKEY,{expiresIn:"10m"});
    } catch (error) {
        console.log(error);
    }
}
module.exports={forgetPasswordToken};
