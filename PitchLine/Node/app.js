var express=require("express");
var fileuploader=require("express-fileupload");
var mysql=require("mysql");
const { urlencoded } = require("express");


var app=express();

 
app.use(express.static("public"));
app.use(express.urlencoded('extended:true'));
app.use(fileuploader());

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
app.get("/shark-profile",function(req,resp){
    resp.sendFile(process.cwd() + "/public/HTML/shark_profile.html");
})
app.get("/founder-profile",function(req,resp){
    resp.sendFile(process.cwd() + "/public/HTML/founder_profile.html");
})

app.get("/shark-dashborad",function(req,resp){
    resp.sendFile(process.cwd() +"/public/HTML/sharkdashboard.html");
})

app.get("/adminpanel",function(re,resp){
    resp.sendFile(process.cwd() + "/public/HTML/adminpanel.html");
})

app.get("/sharkfinder",function(req,resp){
    resp.sendFile(process.cwd() + "/public/HTML/sharkfinder.html");
})
app.get("/founderfinder",function(req,resp){
    resp.sendFile(process.cwd() + "/public/HTML/findfounder.html");
})

app.get("/founder-dashboard",function(req,resp){
    resp.sendFile(process.cwd() + "/public/HTML/founderdashboard.html");
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
    console.log("entered loginajax");
    dbCtrl.query("select utype from USERS where email=? and pwd=?",dataAry,function(err,result){
        console.log(result);
        if(err)
        resp.send(err);
        else
        if(result.length==0)
        {
            resp.send("Invalid ID");
        }
        else
        {
            resp.send(" Login Succefull ");
        }
    })
})






// ----- Shark Profile Save, update, Fetch ................//
// --------------------------------------------------------//

app.post("/shark/Save-profile",function(req,resp){

    console.log(req.body.txtemail);
    console.log(req.body.txtname);


    var profilename="pexels-matt-hardy-3560168.jpg";
    var aadharname="pexels-matt-hardy-3560168.jpg";

    if(req.files.profilepic!=null)
    {
        profilename=req.files.profilepic.name;
        var des=process.cwd()+"/public/uploads/"+profilename;
        req.files.profilepic.mv(des,function(err){
            if(err)
                console.log(err);
            else
            console.log("Profile pic uploaded successfully ");
        })
    }

    if(req.files.aadharpic!=null)
    {
        aadharname=req.files.aadharpic.name;
        var des=process.cwd()+"/public/uploads/"+aadharname;
        req.files.aadharpic.mv(des,function(err){
            if(err)
                console.log(err);
            else
            console.log("aadhar pic uploaded successfully ");
        })
    }

    console.log(req.body.txtemail);
    console.log(req.body.txtname);

    dataAry=[req.body.txtemail,req.body.txtname,
    req.body.txtcontact,req.body.txtaddress,req.body.txtoccupations,req.body.txtcity,profilename,
    aadharname,req.body.txtcategories,req.body.txtcompanies,
    req.body.txtamount,req.body.txtother];

    console.log(dataAry);

    dbCtrl.query("insert into sharkprofile values(?,?,?,?,?,?,?,?,?,?,?,?)",dataAry,function(err){
        if(err)
        {
            resp.send(err);
        }
        else
        {
            resp.send("Recored Saved successfully !!!!!!");
        }
    })
})




app.post("/shark/update-profile",function(req,resp){

    var profilename;
    var aadharname;
    if(req.files.profilepic==null)
    {
        profilename=req.files.profilepic.name;
    }
    if(req.files.aadharpic==null)
    {
        aadharname=req.files.aadharpic.name;
    }


    if(req.files.profilepic!=null)
    {
        profilename=req.files.profilepic.name;
        var des=process.cwd()+"/public/uploads/"+profilename;
        req.files.profilepic.mv(des,function(err){
            if(err)
                console.log(err);
            else
            console.log("Profile pic updated successfully ");
        })
    }

    if(req.files.aadharpic!=null)
    {
        aadharname=req.files.aadharpic.name;
        var des=process.cwd()+"/public/uploads/"+aadharname;
        req.files.aadharpic.mv(des,function(err){
            if(err)
                console.log(err);
            else
            console.log("aadhar pic updated successfully ");
        })
    }

    dataAry=[req.body.txtname,
        req.body.txtcontact,req.body.txtaddress,req.body.txtoccupations,req.body.txtcity,profilename,
        aadharname,req.body.txtcategories,req.body.txtcompanies,
        req.body.txtamount,req.body.txtother,req.body.txtemail];
    
        console.log(dataAry);
    
        dbCtrl.query("update sharkprofile set pname=?,contact=?,Address=?,occupation=?,City=?,Profilepic=?,Aadharpic=?,categories=?,companycount=?,amount=?,Additional=? where email=?",dataAry,function(err){
            if(err)
            {
                resp.send(err);
            }
            else
            {
                resp.send("Recored updated successfully !!!!!!");
            }
        })
})




app.get("/JSONsearchrecord",function(req,resp){
    var email=req.query.emailkuch;
    console.log(email);
    dbCtrl.query("select * from  sharkprofile where email=?",[req.query.emailkuch],function(err,result){
        if(err)
        resp.send(err);
        else
        resp.send(result);
    })

})

// Shark Dashboard Save investments

app.post("/shark/Investment-Save",function(req,resp){
    console.log("jkbkj");
    dataAry=[req.body.mail,req.body.cmp,req.body.amount,req.body.txtarea];
    console.log(dataAry);

    dbCtrl.query("insert into  investments values(?,?,?,?)",dataAry,function(err){
        if(err)
        resp.send(err);
        else
        resp.send("Record Saved");
    })
})



// Shark Found Founders







// Founderss Dashboard Complete Code ----- >>>>>>>>>>>>>>>---->>>>>>>>>>>>>>>>>


// ----- founder Profile Save, update, Fetch ................//
// --------------------------------------------------------//

app.post("/founder/Save-profile",function(req,resp){
    
    var profilename="pexels-matt-hardy-3560168.jpg";
    var aadharname="pexels-matt-hardy-3560168.jpg";

    if(req.files.profilepic!=null)
    {
        profilename=req.files.profilepic.name;
        var des=process.cwd() + "/public/uploads"+ profilename;
        req.files.profilepic.mv(des,function(err){
            if(err)
            console.log(err);
            else
            console.log("profile Pic uploaded");
        })
    }
    
    if(req.files.aadharpic!=null)
    {
         aadharname=req.files.aadharpic.name;
        var des=process.cwd() + "/public/uploads" + aadharname;
        req.files.aadharpic.mv(des,function(err){
            if(err)
            console.log(err);
            else
            console.log("Aadhar Pic uploaded");
        })
    }

    dataAry=[req.body.txtemail,req.body.txtname,req.body.txtcontact,req.body.txtaddress,
    req.body.txtcity,profilename,aadharname,req.body.txtcompanies,req.body.txtestdin,
    req.body.txtsales,req.body.txtpartner,req.body.txtevaluation,req.body.txtother];

    dbCtrl.query("insert into founderprofile  values(?,?,?,?,?,?,?,?,?,?,?,?,?)",dataAry,function(err){
        if(err)
        resp.send(err);
        else
        resp.send("Founder Record Saved");
    })
})

app.post("/founder/update-profile",function(req,resp){
    var profilename;
    var aadharname;

    if(req.files.profilepic==null)
    {
        profilename=req.files.profilepic.name;
    }
    if(req.files.aadharpic==null)
    {
        aadharname=req.files.aadharpic.name;
    }

    if(req.files.profilepic!=null)
    {
        profilename=req.files.profilepic.name;
        var des=process.cwd()+"/public/uploads/"+profilename;
        req.files.profilepic.mv(des,function(err){
            if(err)
                console.log(err);
            else
            console.log("Profile pic updated successfully ");
        })
    }

    if(req.files.aadharpic!=null)
    {
        aadharname=req.files.aadharpic.name;
        var des=process.cwd()+"/public/uploads/"+aadharname;
        req.files.aadharpic.mv(des,function(err){
            if(err)
                console.log(err);
            else
            console.log("aadhar pic updated successfully ");
        })
    }

    dataAry=[req.body.txtname,req.body.txtcontact,req.body.txtaddress,
        req.body.txtcity,profilename,aadharname,req.body.txtcompanies,req.body.txtestdin,
        req.body.txtsales,req.body.txtpartner,req.body.txtevaluation,req.body.txtother , req.body.txtemail];

    console.log(dataAry);

    dbCtrl.query("update founderprofile set fname=?,contact=?,Address=?,City=?,Profilepic=?,Aadharpic=?,company=?,estdin=?,sales=?,partners=?,evaluation=?,Additional=?",dataAry,function(err,result){
        if(err)
        {
            resp.send(err);
        }
        else
        {
            resp.send("Record updated");
        }
    })
})

app.get("/JSONsearchrecordfounder",function(req,resp){
    var email=req.query.emailkuch;
    console.log(email);
    dbCtrl.query("select * from founderprofile where email=?",[req.body.emailkuch],function(err,result){
        console.log(result);
        if(err)
            resp.send(err);
        else
            resp.send(result);
    })
})


////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////



app.get("/sharkfetchall",function(req,resp){

    dbCtrl.query("select * from sharkprofile ",function(err,result){
        if(err)
        resp.send(err);
        else
        resp.send(result);
    })
})

app.get("/delete-angular",function(req,resp){
    dbCtrl.query("delete  from USERS where email=?",[req.query.emailkuch],function(err,result){
        if(err)
        resp.send(err);
        else{
        if(result.affectedRows==0)
        resp.send("Invalid ID");
        else
        resp.send("Deleteed");
        }
    })
})



// -------------------------find the shark and founder code ----------------------------------------
// >>>>>>>>>>>>>>>>>>>>>>>>>>----------------------------------------------------->>>>>>>>>>>>>>>>>
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


app.get("/getcategory",function(req,resp){
    dbCtrl.query("select * from sharkprofile",function(err,result)
    {
        if(err)
        resp.send(err);
        else
        resp.send(result);
    })
})

app.get("/getcity",function(req,resp){
    dbCtrl.query("select  * from sharkprofile",function(err,result)
    {
        if(err)
        resp.send(err);
        else
        resp.send(result);
    })
})

app.get("/getevaluation",function(req,resp){
    dbCtrl.query("select  * from founderprofile  ",function(err,result)
    {
        if(err)
        resp.send(err);
        else
        resp.send(result);
    })
})
app.get("/getcompany",function(req,resp){
    dbCtrl.query("select  * from founderprofile  ",function(err,result)
    {
        if(err)
        resp.send(err);
        else
        resp.send(result);
    })
})

app.get("/getsharkcards",function(req,resp){
    dataAry=[req.query.categorykuch,req.query.Citykuch];
    console.log(dataAry);
    dbCtrl.query("select * from sharkprofile where company like ? and City=?",dataAry,function(err,result){
        if(err)
        resp.send(err);
        else
        resp.send(result);
    })
})

app.get("/getfoundercards",function(req,resp){
    dataAry=[req.query.Companykuch,req.query.Evaluationkuch];
    console.log(dataAry);
    dbCtrl.query("select * from sharkprofile where categories like ? and City=?",dataAry,function(err,result){
        if(err)
        resp.send(err);
        else
        resp.send(result);
    })
})



