const express=require("express")
const router=express.Router();
const authController=require('../controller/authcontroller')
// testing 
router.get('/test',(req,res)=>{
    res.json({msg:"hellow world"})
})

//register
router.post('/register',authController.register)
//login
router.post('/login',authController.login)


module.exports=router;

