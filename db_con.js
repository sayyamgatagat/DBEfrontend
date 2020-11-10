const mysql = require('mysql')
const express = require('express')

const app = express()
const port = 3000

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "sayyam123",
    database: "insurance",
    insecureAuth : true
  });
  

  con.connect();
  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  app.get('/index',(req,res)=>{
    con.query('SELECT *  from agent', function (error, results, fields) {
      if (error) throw error;
      else{
        console.log(results);
        res.render("/views/index", { results, error: undefined });
      }
    });
  });
  

  app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`)
  })
  
  con.end();