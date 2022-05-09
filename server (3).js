const { urlencoded } = require("express");
var express=require("express");
var fileuploader=require("express-fileupload");
var mysql=require("mysql");

var app=express();

app.listen(2003,function(){
    console.log("server started");
})
var DbConfigKuch={
    host:"localhost",
    user:"root",
    password:"bce",
    database:"2022-jan"
}

var dbCtrl=mysql.createConnection(DbConfigKuch);
dbCtrl.connect(function(err){
    if(err)
        console.log(err);
        else
        console.log("**** Connnecccttteeddddd.....");
})

app.use(express.static("public"));
//url. hand.
app.get("/",function(req,resp){
    //console.log("Home page");
    //resp.send("<h1>Welcome... Ites Home Page</h1>");
    resp.sendFile(__dirname+"/public/index.html");
})
app.get("/signup",function(req,resp){
    resp.set("html");
    //resp.send("<h2><center>Signup Here</center></h2>");//response
    resp.sendFile(__dirname+"/public/signup.html");
})

app.get("/login",function(req,resp){
    resp.set("html");//optional
    //resp.send("<h2><center>Login Here</center></h2>");
    resp.sendFile(process.cwd()+"/public/login.html");
})

app.get("/info",function(req,resp){
    resp.contentType("text/html");
    resp.write(__dirname);
    resp.write("<br>");
    resp.write("<b>"+__filename+"</b><br>");
    resp.write(process.cwd());
    resp.end();
})

app.get("/signup-process-get",function(req,resp){
    console.log(req.query); //query is a json object
    var uid=req.query.txtUid;  
    var tech="";
    if(req.query.techJava!=undefined)
        tech=tech+req.query.techJava+",";   
    
    if(req.query.techFull!=undefined)
        tech=tech+req.query.techFull+",";   

    console.log(tech);

    //resp.send("Welcome "+uid+"<br> Signed Up Successfullyy");
    console.log(req.query.txtPwd+"  "+req.query.txtMob);
    console.log(req.query.rad);
    console.log(req.query.city);

    var books="";
    for(i=0;i<req.query.books.length;i++)
    {
        books+=req.query.books[i]+",";
    }
    console.log(books);

    resp.send(req.query);
})


//----------------------------------------------
app.use(express.urlencoded('extended:true')); //converts binary data to JSON Object and store it in body object
app.use(fileuploader());//passing object as argument

app.post("/signup-process-post", function(req,resp){
    console.log("****");
    console.log(req.body); //query is a json object

     if(req.files!=null)
     {
        var cur=new Date();
        console.log(cur);
        var newName=req.body.txtUid+"-"+cur.getTime()+"-"+req.files.profilePic.name;
        console.log(newName+" &&&&&&&&");
    var kuchName=newName;  //files- is an object containg info. about files being uploaded
    var des=process.cwd()+"/public/uploads/"+kuchName;
    console.log(des+" ^^^^^^^^^^^^^^^^^^^");
     req.files.profilePic.mv(des, function(err)
    {
        if(err)
           {
            console.log("#############");
           console.log(err);
           }
            else
            {
                console.log("1.File Uploaded Successfullllyyyy");
                console.log("2. ***** File Name="+kuchName);
            }
    });
}
     else
     {
         resp.send("No Pic Uploaded");
     }
     
     resp.send(resp.send(req.body));
})

app.get("/profile",function(req,resp){
       
    resp.sendFile(process.cwd()+"/public/profile.html");
})
app.post("/profile-delete-post",function(req,resp)
{
    var uid=req.body.txtUid;
    dbCtrl.query("delete from profileapril where uid=?",[uid],function(err,result){
        if(err)
        resp.send(err);
        else if(result.affectedRows==0)
        resp.send("Invalid Id");
        else
        resp.send("Record Deleted Successfully");
    })
});
app.post("/showAll",function(req,resp)
{
    dbCtrl.query("select * from profileapril",function(err,result){
        if(err)
            resp.send(err);
        else
            resp.send(result);
    })
})
app.post("/profile-save", function(req,resp){
var newName="nopic.png";
    if(req.files!=null)
    {
        newName=req.body.txtUid+"-"+req.files.profilePic.name;
        var des=process.cwd()+"/public/uploads/"+newName;
        req.files.profilePic.mv(des, function(err)
        {
         if(err)
               console.log(err);
          else
                console.log("1.File Uploaded Successfullllyyyy");
        });
    }

    var dataAry=[req.body.txtUid,req.body.txtName,req.body.txtMob,newName];
     dbCtrl.query("insert into profileapril values(?,?,?,?,current_date())",dataAry,function(err){
            if(err)
                resp.send(err);
            else
            {
               resp.send("Record saved successfully"); 
            }
        
    })
    //--------------------
  })

//==================================
app.post("/profile-update", function(req,resp){
    var newName;

    //if req.files==null , it means user dont want to change the pic
    //then use the old pic name to update
    if(req.files==null)//no change in pic
    {
        newName=req.body.oldPic;
    }else
        if(req.files!=null)
        {
            newName=req.body.txtUid+"-"+req.files.profilePic.name;
            var des=process.cwd()+"/public/uploads/"+newName;
             req.files.profilePic.mv(des, function(err)
            {
             if(err)
                   console.log(err);
              else
                    console.log("1.File Uploaded Successfullllyyyy");
            });
        }
    
        var dataAry=[req.body.txtName,req.body.txtMob,newName,req.body.txtUid];
         dbCtrl.query("update profileapril set name=?,mobile=?,picname=? where uid=?",dataAry,function(err){
                if(err)
                    resp.send(err);
                else
                {
                   resp.send("Record Updated successfully"); 
                }
            
        })
        //--------------------
      })
    
//==================================

app.get("/ajaxCheckUser",function(req,resp){
    console.log("Hi"+req.query.uidKuch);
    //  1 - 0 
    dbCtrl.query("select * from profileapril where uid=?",[req.query.uidKuch],function(err,result)
    {
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

//service-rest api

app.get("/JSONserachRecord",function(req,resp)
    {
        var uid=req.query.uidKuch;
        //uid primary key in table
                                                    //table wala col-uid
        dbCtrl.query("select * from profileapril where uid=?",[req.query.uidKuch],function(err,result)
        {
                if(err)
                resp.send(err);
                else
                resp.send(result);
        })
    });

//var DbConfigKuch=require("./config/dbCofigFile");