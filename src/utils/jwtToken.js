const jwt = require("jsonwebtoken");

const getToken = async(payload)=>{
    try {
        return await jwt.sign({payload},process.env.SECRETKEY);
    } catch (error) {
        console.log(error);
    }
}
module.exports={getToken};
