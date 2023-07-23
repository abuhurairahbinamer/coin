const mongoose=require('mongoose');
const {MongoDb_connnection_String}=require("../config/index");
const connect=process.env.MongoDb_connnection_String;

const dbconnect=async ()=>{

try {
    const con1= await mongoose.connect(connect);
    console.log("database is connected to host "+con1.connection.host);
} catch (error) {
    console.log("Error is:"+error);
}
}

module.exports= dbconnect;
