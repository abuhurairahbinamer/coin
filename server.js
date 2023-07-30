const express=require('express');
const dbconnect=require("./database/index");
const app=express();
const {PORT}=require('./config/index')
const errorHandler=require('./middleware/errorHandling')
// const Blog=require('./models/blog');
// const User=require('./models/user');
const router=require('./routes/index')
const cookieParser=require('cookie-parser');

app.use(cookieParser());
app.use(express.json({limit:"50mb"}));  // application can send and receive data in jason form -->{limit:"50mb"} is used to increase the limit of the req.body i.e if larger image is passed than it will not thrown the error


app.use(router);

dbconnect();
const PORT1=PORT





// app.get('/',(req,res)=> res.json({msg:"helloew world"}))
app.use(errorHandler);  // always try to keep it at the end
app.listen(PORT1,()=>{   // you did not pass parameter here so the there was no response on browser
    console.log("app is running at the port  " + PORT1 );
});

// app.listen(PORT,console.log(`backend is running on port: ${PORT}`))