var express=require("express");
var fileuploader=require("express-fileupload");
var mysql=require("mysql");
const { urlencoded } = require("express");


var app=express();

// this line is added to add js and css to the file 
app.use(express.static("public"));


app.listen(8000,()=>{
    console.log("server started");
})



app.get("/",function(req,resp){
    // console.log(process.cwd());
    resp.sendFile(process.cwd() + "/public/HTML/index.html");
})


