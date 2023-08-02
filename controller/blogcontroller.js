// const cloudinary = require("cloudinary").v2;
const Joi=require("joi")
const fs=require('fs');
const Blog=require('../models/blog')
const {BACKEND_SERVER_PATH}=require('../config/index')
const BlogDTO=require('../dto/blog')
const BlogsDetailsDTO=require('../dto/blogs-details')
// const {CLOUD_NAME,CLOUD_KEY,CLOUD_KEY_SECRET}=require('../config/index')
// cloudinary.config({
  //   cloud_name: CLOUD_NAME,

  //   api_key: CLOUD_KEY,

  //   api_secret: CLOUD_KEY_SECRET,
  // });
  const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;
const blogController={
async create(req,res,next){
   // 1. validate req body

      const createBlogSchema=Joi.object({
        title:Joi.string().required(),
        author:Joi.string().regex(mongodbIdPattern).required(),
        content:Joi.string().required(),
          // client side -> base64 encoded string -> decode -> store in locally -> save photo's path in db
        photo:Joi.string().required()
      })

const {error}=createBlogSchema.validate(req.body);
if(error){
  console.log("validation error")
    return next(error)
}

const { title, author, content, photo } = req.body;

   //2.read as buffer
   const buffer = Buffer.from(
      photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
      "base64"
    );
   // allot random name
   const imagePath = `${Date.now()}-${author}.png`;

    
  


// console.log(`${BACKEND_SERVER_PATH}/storage/${imagePath}`)
   //3. store data in database
   let newBlog;
   try {
     newBlog = new Blog({
       title,
       author,
       content,
       photoPath:`${BACKEND_SERVER_PATH}/storage/${imagePath}`
     });

     await newBlog.save();
   } catch (error) {
    console.log("db error",error.message);
     return next(error);
   }
   // save image locally
   try {
    fs.writeFileSync(`storage/${imagePath}`, buffer);
   } catch (error) {
    return next(error);
   }

//4. return response 
   const blogDto = new BlogDTO(newBlog);

   return res.status(201).json({ blog: blogDto });



   
},
async getall(req,res,next){
  try {
    const blogs=await Blog.find({});

    let blogDto=[]
    for(let i=0; i<blogs.length; i++){
      let p=new BlogDTO(blogs[i]);
      blogDto.push(p);
    }

    return res.status(200).json({blogs:blogDto});
  } catch (error) {
    return next(error)
  }
},
async getById(req,res,next){
// validate
const getByIdSchema=Joi.object({
  id:Joi.string().regex(mongodbIdPattern).required()
})

const {error}=getByIdSchema.validate(req.params)
if (error){
  return next(error);
}
const {id}=req.params;
let blog
try {
   blog= await Blog.findOne({_id:id}).populate('author');

} catch (error) {

  return next (error);

}

const blog_details_Dto=new BlogsDetailsDTO(blog);
// send response
return res.status(200).json({blog:blog_details_Dto});



},

async update(req,res,next){

},
async delete(req,res,next){}
}

module.exports=blogController;