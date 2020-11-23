const mysql = require('mysql')
const express = require('express')
const bodyParser = require('body-parser')
const md5 = require('md5')
const app = express()
const port = 3000

app.set('view engine', 'ejs');
app.engine('.html', require('ejs').renderFile); // register .html as an engine in express view system
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
  con.connect();

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  /* call login */
  app.get('/login',(req,res)=>{
    res.render(__dirname + '/views/login.ejs')
  })

  /*login validation*/

  app.post('/loguser',(req,res)=>{
    var userid = req.body.userid;
  
    var quer = 'select * from cred where username =' + userid;
    console.log(userid);

  })

  app.listen(port, () => {
      console.log(`App started at http://localhost:${port}`)
  })
  


  /* ending database connection */
  con.end();