const express=require("express")
const router=express.Router();
const authController=require('../controller/authcontroller')
const auth=require('../middleware/auth');
// testing 
router.get('/test',(req,res)=>{
    res.json({msg:"hellow world"})
})

//register
router.post('/register',authController.register)
//login
router.post('/login',authController.login)
// logout
router.post("/logout",auth,authController.logout)
// refresh token
router.get("/refresh",authController.refresh)
module.exports=router;

