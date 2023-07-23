const dotenv=require('dotenv').config();
const PORT=process.env.PORT;
const MongoDb_connnection_String=process.env.MongoDb_connnection_String;
const Access_Token_Secret=process.env.Access_Token_Secret;
const Refresh_Token_Secret=process.env.Refresh_Token_Secret;


module.exports={
    PORT,
    MongoDb_connnection_String,
    Access_Token_Secret,
    Refresh_Token_Secret
}