const mysql = require('mysql')
const express = require('express')
const bodyParser = require('body-parser')
const md5 = require('md5')
const app = express()
const port = 3000

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
  })

  /*login validation*/
  app.post('/loguser',urlencodedParser,function(req,res){
    var userid = req.body.userid;
    var pass = md5(req.body.password);
    var quer = "select * from cred where username = " + userid;
    
    console.log(userid + "is trying to log in");
    con.query(quer,function(err,results,fields){
      if(pass == results[0].password){
        console.log("Success!");
        con.query("select name from customer where customer_id="+userid,function(err,results,fields){
          res.render('customer',{uid : userid, name: results[0].name }); // renders username and password 
        })
      }
      else{
        console.log("unsuccessful!!");
      }
    });
    

  });

  app.listen(port, () => {
      console.log(`App started at http://localhost:${port}`)
  })