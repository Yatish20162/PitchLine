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

// database connection
// -----------------------------------------------
var dbconfig={
    host:"localhost",
    user:"root",
    password:"yatish@2002",
    database:"pitchline"
}

var dbCtrl=mysql.createConnection(dbconfig);

dbCtrl.connect(function(err){
    if(err)
    console.log(err);
    else
    console.log("connection established");
})
// ----------------------------------------------------



app.get("/",function(req,resp){
    resp.sendFile(process.cwd() + "/public/HTML/index.html");
})


app.get("/ajaxCheckUser",function(req,resp){
    console.log(req.query.mail);
    dbCtrl.query("select * from USERS where email=?",req.query.mail,function(err,result){
        console.log(result);
        if(err)
            resp.send(err);
            else
            {
              if(result.length==0)
                resp.send("Available");
                else
                resp.send("Already Occupied");
            }
    })
})

app.get("/Signupajax",function(req,resp){
    var dataAry=[req.query.mailkuch,req.query.pwdkuch,req.query.typekuch];
    console.log("entered signupajax");
    dbCtrl.query("insert into USERS values(?,?,?,current_date())",dataAry,function(err,result){
        if(err)
        {
            resp.send(err);
        }
        else
        resp.send("Record Saved succefully");
    });
})

app.get("/loginajax",function(req,resp){
    var dataAry=[req.query.emailkuch,req.query.pwdkuch];
    dbCtrl.query("select utype from USERS where email=? and pwd=?",dataAry,function(err,result){
        if(err)
        resp.send(err);

        if(result.length==0)
        {
            resp.send("Invalid ID");
        }
        else
        {
            resp.send(" Login Succefull ,  Welcome" + result[2].utype);
        }
    })
})

