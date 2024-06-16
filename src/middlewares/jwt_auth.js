const jwt = require("jsonwebtoken");
const jwtAuthMiddleware= async(req,res,next)=>{
        try {
            const token = req.headers.authorization.split(" ")[1];
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