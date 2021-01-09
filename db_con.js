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

let policyTypes = [
  {
    pname : "Care Freedom",
    id : 0,
    img : './src/care.png',
    type : 'General insurance',
    desc: 'Insure now and get coverage of upto 3,00,000. Policy does not cover against existing health issues'
  },
  {
    pname : "Heart Buddy",
    id : 1,
    img : './src/heartbuddy.png',
    type : 'For Heart patients',
    desc: 'If you are a heart patient, this policy is for you. Get coverage of upto 7,00,000'
  },
  {
    pname : "Assure Diamond",
    id : 2,
    img : './src/diamond.png',
    type : 'Higher cover amount',
    desc: 'Get coverage of upto 12,00,000. Claims settled in 4 days.'
  },
  {
    pname : "Health Guard",
    id : 3,
    img : './src/healthguard.webp',
    type : 'General insurance',
    desc: 'Insure now and get coverage of upto 5,00,000. Policy does not cover against existing health issues'
  },
  {
    pname : "Corona Kavach",
    id : 4,
    type : 'Immediate Activation',
    img : './src/cokavach.jpg',
    desc: 'Get upto 8,00,000 in case of hospitalisation. Active from next day.'
  },
  {
    pname : 'Arogya Sanjeevani',
    id : 5,
    type : 'The All in One Policy',
    img : './src/Arogya-Sanjeevani-policy.jpg',
    desc: 'Get insurance cover for all issues. For existing issues premium will be higher.'
  },
]



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

  /*Home page call*/
  app.get('/',(req,res)=>{
    res.render('index');
  });

  /* call login */
  app.get('/login',(req,res)=>{
    res.render("login",{error : undefined})
  });
  /*login validation*/
  app.post('/loguser',urlencodedParser,function(req,res){
    userid = req.body.userid;
    var pass = md5(req.body.password);
    var quer = "select * from cred where username = " + userid;
    
    console.log(userid + "is trying to log in");
    con.query(quer,function(err,results,fields){
      if(results == undefined){
        res.render("login",{unf: "User not found! Try creating a new Account!!", error : "Incorrect Username"});
        console.log("incorrect username!!");
      }
      else if(pass == results[0].password){
        console.log("Success!");
        con.query("select * from customer where customer_id="+userid,function(err,results,fields){
          res.render('customer',{uid : userid, details: results[0], policyTypes }); // renders username and password and calls customer dashboard
        });
      }
      else{
        res.render("login",{unf: "User not found! Try creating a new Account!!", error : "Incorrect Password"});
        console.log("Incorrect password");
      }
    });
    
  });

  /* Signup call*/
  app.get("/signup",(req,res)=>{
    res.render("signup");
  });
  /* */

  /*profile*/
  app.get('/profile',(req,res)=>{
    con.query("select * from customer where customer_id="+userid,function(err,results,fields){
      con.query("select * from policy where policy_no = "+results[0].policy_no,function(error,result,field){
        pdetails = result[0];
        console.log(typeof(pdetails.maturity_date));
        res.render('profile',{uid : userid, details: results[0], pdet : pdetails });
      })
    });
  });

  /*Customer call */
  app.get("/customer",(req,res)=>{
    res.render("customer",{uid : userid, details: details, policyTypes });
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
    con.query("insert into contact values(?,?,?,?,?)",[name,req.body.email,req.body.phone,req.body.date,req.body.msg],function(err,results,fields){
      if(err){
        throw err;
      }
      else
      console.log(results);
    })
    console.log(name,req.body.email,req.body.phone,req.body.date,req.body.msg);
  });

  /*Agent call */
  app.get('/schedulecall',(req,res)=>{


    res.render("schedulecall");
  });


  /*app listen*/
  app.listen(port, () => {
      console.log(`App started at http://localhost:${port}`)
  })
