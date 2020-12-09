const mysql = require('mysql')
const express = require('express')
const bodyParser = require('body-parser')
const md5 = require('md5')
const app = express()
const port = 3000
const loggedin = false;
let userid;
let details;
let policyid;
let policytype;
let pdetails;

app.set('view engine', 'ejs');

/* middleware */
var urlencodedParser = bodyParser.urlencoded({ extended: false })

/* defining database */
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "sayyam123",
    database: "insurance",
    insecureAuth : true
  });

  /* To start from the landing page */
  app.use(express.static('views'));
  
  /* Starting database connection */
  con.connect(function (error) {
    if (error) {
        console.log("Error in Connecting Database");
        throw error;
    }
    else {
        console.log("Connected to Database");
    }
});



  /* call login */
  app.get('/login',(req,res)=>{
    res.render("login")
  });
  /*login validation*/
  app.post('/loguser',urlencodedParser,function(req,res){
    userid = req.body.userid;
    var pass = md5(req.body.password);
    var quer = "select * from cred where username = " + userid;
    
    console.log(userid + "is trying to log in");
    con.query(quer,function(err,results,fields){
      if(results.length == 0){
        res.render("login",{unf: "User not found! Try creating a new Account!!"});
        console.log("incorrect username!!");
      }
      else if(pass == results[0].password){
        console.log("Success!");
        con.query("select * from customer where customer_id="+userid,function(err,results,fields){
          res.render('customer',{uid : userid, details: results[0] }); // renders username and password and calls customer dashboard
        });
      }
      else{
        console.log("Incorrect password");
      }
    });
    
  });

  /* Signup call*/
  app.get("/signup",(req,res)=>{
    res.render("signup");
  });


  /*profile*/
  app.get('/profile',(req,res)=>{
    con.query("select * from customer where customer_id="+userid,function(err,results,fields){
      res.render('profile',{uid : userid, details: results[0], pdet : pdetails });
    });
  });

  /*admin call*/
  app.get('/admin',(req,res)=>{
    res.render("admin");
  });

  /*admin call*/
  app.get('/agent',(req,res)=>{
    res.render("agent");
  });

  /*Schedule call  */
  app.get('/schedulecall',(req,res)=>{
    res.render("schedulecall");
  });

  /*store contact form details */
  app.post("/schedulecall",urlencodedParser,(req,res)=>{
    name = req.body.fname + ' ' + req.body.lname;
    con.query("insert into contat values(?,?,date(?),?,?)",[name,req.body.email,req.body.phone,req.body.date,req.body.msg],function(err,results,fields){
      console.log(results);
    })
    console.log(name,req.body.email,req.body.phone,req.body.date,req.body.msg);
  });


  /*app listen*/
  app.listen(port, () => {
      console.log(`App started at http://localhost:${port}`)
  })
