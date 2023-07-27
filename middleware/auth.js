const JWTService=require('../services/JWTService');
const User=require('../models/user');
const userDTO=require('../dto/user');
const  auth= async(req,res,next)=>{

const {refreshToken,accessToken}=req.cookies;
if(!refreshToken || !accessToken){
const error={
    status:401,
    message:"unathorized"
}
return next(error);
}

let id;
try {
    _id= JWTService.verfiyRefreshToken(refreshToken)._id; 
    
    // _id= JWTService.verfiyaccessToken(accessToken)._id;  -> you can also use this

    const user=await User.findOne({_id:_id})
    const userDto=new userDTO(user);
    
    req.user=userDto
    next();

} catch (error) {
    return next(error)
}



}




module.exports=auth;
