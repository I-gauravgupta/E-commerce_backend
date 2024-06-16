const jwt = require("jsonwebtoken");
const jwtAuthMiddleware= async(req,res,next)=>{
    if (!req.headers.authorization) {
        return res.status(401).json({ msg: "No token provided in the header" });
    }

        try {
            const token = req.headers.authorization.split(" ")[1];
            // console.log(token)
        try {
            if(token){
                const decoded = await jwt.verify(token,process.env.SECRETKEY);
                req.userPayload=decoded; 
                next();
            }
        } catch (error) {
            console.log(error);
            res.status(401).json({msg:"invalid Token"})
        }
        } catch (error) {
            console.log(error);
            res.status(401).json({msg:"no Token"})
        }
    }
module.exports={jwtAuthMiddleware};