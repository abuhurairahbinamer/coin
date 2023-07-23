const jwt=require("jsonwebtoken");
const {Access_Token_Secret,Refresh_Token_Secret}=require('../config/index');
const RefreshToken=require('../models/token')
class JWTService{
    //sign access token
  static signAccessToken(payload,expiryTime){
return jwt.sign(payload,Access_Token_Secret,{expiresIn:expiryTime})
}
    //sign refresh token
static signRefreshToken(payload,expiryTime){
        return jwt.sign(payload,Refresh_Token_Secret,{expiresIn:expiryTime})
     }
    //verify access token
    
static verifyAccessToken(token){
    return jwt.verify(token,Access_Token_Secret)
}

    //verify refresh token

 static verfiyRefreshToken(token){
    return jwt.verify(token,Refresh_Token_Secret)
  }  
    //store refresh token
  static  async storeRfreshToken(Token,userId){
        try {
          const newToken=  new RefreshToken({
                token:Token,
                userId:userId
            })
            await newToken.save();
        } catch (error) {
           console.log(error) 
        }
    }


}

module.exports=JWTService;