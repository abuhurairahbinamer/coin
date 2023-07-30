const express=require("express")
const router=express.Router();
const authController=require('../controller/authcontroller');
const auth=require('../middleware/auth');
const blogController=require('../controller/blogcontroller');
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
// blog

// create
router.post("/blog",auth,blogController.create)

//get all
router.get('/blog/all',auth,blogController.getall)

//get blog by id
router.get('/blog/:id',auth,blogController.getById);

//update
router.put('/blog',auth,blogController.update);

// delete
router.delete('/blog/:id',auth,blogController.delete);


module.exports=router;

