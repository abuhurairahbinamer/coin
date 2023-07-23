const Joi=require('joi');
const bcryptjs=require('bcryptjs');
const User=require("../models/user");
const userDTO = require('../dto/user');
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;
const JWTService=require('../services/JWTService');
const RefreshToken=require("../models/token")
const authController={
async register(req,res,next){
    // console.log(req.body)
//1.validate user input
const userRegisterSchema=Joi.object({
    username:Joi.string().min(5).max(30).required(), 
    name:Joi.string().max(30).required(),
    email:Joi.string().email().required(),
    password: Joi.string().pattern(passwordPattern).required(),
    confirmPassword: Joi.ref("password"),

})


//2.if error in validation ->return error via middleware
const { error } =  userRegisterSchema.validate(req.body);

if(error){
    return next(error)
}


//3.email or username is already registered ->return error
const {username,name,email,password}=req.body;
// check if the email is not already registered
try {
    // console.log("i am validating email")
    const emailInUse =await User.exists({email});
    const userNameInUse =await User.exists({username});

    if(emailInUse){
        // console.log("Ëmail already")
        const error={
            status:409,
            message:"Email already registered ,use another email"
         }
    return next(error)
    }
    
    if(userNameInUse){
        console.log("Username already")
        const error={
            status:409,
            message:"username already registered ,use another username"
        }
        return next(error)
    }


} catch (error) {
    // console.log("catch error")
    return next(error)
}

//4.password hash
const hashedPassword=await bcryptjs.hash(password,10); // 10 means 10 times salting

//5.store user data in db
let accessToken;
let refreshToken;
let user;
try {
    const userToRegister=new User({
        username,
        email,
        name,
        password:hashedPassword
    })
    
      user=await userToRegister.save(); 
     
     // token generation 
     accessToken=JWTService.signAccessToken({_id:user._id},'30m'); // we removed username:user.username from the payload
     refreshToken=JWTService.signRefreshToken({_id:user._id},'60m');
} catch (error) {
    return next(error);
}

// storing refresh token in databse
JWTService.storeRfreshToken(refreshToken,user._id)
// sending token as response
res.cookie('accessToken',accessToken),{
    maxAge:1000 * 60 * 60 * 24,
    httpOnly:true  // we can,t access it on client side , we can access it on server side when refresh token will be sent to backend
}

res.cookie('refreshToken',refreshToken),{
    maxAge:1000 * 60 * 60 * 24,
    httpOnly:true  
}

//6.response send
const userDto=new userDTO(user)
return res.status(201).json({user:userDto,auth:true}) // auth true will be discussed in front end  

},
async login(req,res,next){
//1.validate user input
const userLoginSchema=Joi.object({
    username:Joi.string().min(5).max(25).required(),
    password:Joi.string().pattern(passwordPattern).required()
})
//2.if validation error ->return error
const {error}=userLoginSchema.validate(req.body)
if(error){
    // console.log("hellow")
    return next(error)

}
//3.match username 
const {username,password}=req.body;
let user
try {
     user=await User.findOne({username:username})
    if(!user){
        const error={
            status:401,
            message:"invalid username or password"
        }
        return next(error)
    }
// match password
// req.body.password->hash->match with hash in database
   const match= await bcryptjs.compare(password,user.password);
   if(!match){
    const error={
        status:401,
        message:"invalid username or password"
    }
    return next(error)
   }
} catch (error) {

 return next(error);
    
}
// token generation
const accessToken=JWTService.signAccessToken({_id:user._id},'30m')
const refreshToken=JWTService.signRefreshToken({_id:user._id},'60m')


// update token in database
try {
    
  await  RefreshToken.updateOne({
        _id:user._id 
     },
     {token: refreshToken },
     {upsert:true}   // if record is matched then update if does not match then create new record
     
     
     )
     
} catch (error) {
    return next(error)
}

res.cookie('accessToken',accessToken),{
    maxAge:1000 * 60 * 60 * 24,
    httpOnly:true  // we can,t access it on client side , we can access it on server side when refresh token will be sent to backend
}

res.cookie('refreshToken',refreshToken),{
    maxAge:1000 * 60 * 60 * 24,
    httpOnly:true  
}



//4. return reponse
const userDto=new userDTO(user)
return res.status(200).json({user:userDto,auth:true})  // auth true will be discussed in front end 

}
}
module.exports=authController;















