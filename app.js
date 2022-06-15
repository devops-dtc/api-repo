const express = require('express');
const fs = require("fs");
const app = express();
var cors = require('cors');
const multer = require('multer');
var bodyParser = require('body-parser');

const mysql = require('mysql');
const pool = mysql.createConnection({
 host: "localhost",
 user: "root",
 password: "",
 database: "educationdb",
});

pool.connect();

const port = 8081;


const Storage = multer.diskStorage({
    destination(req, file, callback) {
      callback(null, './images')
    },
    filename(req, file, callback) {
      callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`)
    },
  })
  
  const upload = multer({ storage: Storage })



app.use('*', cors());


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var server = app.listen(port, function () {
    var host = server.address().address
    var port = server.address().port
    
    console.log("Example app listening at", host, port)
 })





 app.post('/api/upload', upload.array('photo', 3), (req, res) => {
    //console.log('file', req.files)
    //console.log('body', req.body)
    res.status(200).json({
      message: 'success!',
    })
  })




 app.get('/', function (req, res) {
    //console.log("checking")
    res.send('Hello World');
 })


app.post('/user/login',(req,res) => {    
    username =  req.body.username;
    password =  req.body.password;
    let query = "select * from users where (email='"+username+ "' OR username='" + username + "' OR mobile='"+ username +"') AND password = '"+password+"'";   
    pool.query(query, (error,result)=> {
        if(error){
            throw error
        }
        if(result.length > 0){           
            res.status(200).json({accessToken:'123572-GIRESH-GQWYPR-AZCSEYK', userdetail:result})
        } else {
            res.status(403).json({error:'username/password do not match'})
        }
    }) 
}) 

app.post('/user/register', (req,res) => {
    let name =  req.body.name;
    let username =  req.body.username;
    let password =  req.body.password;
    let mobile =  req.body.mobile;
    let email =  req.body.email;

    let query = "INSERT into users (name,username,password,mobile,email) VALUES ('"+name+"','"+username+"','"+password+"','"+mobile+"','"+email+"')";
    pool.query(query, (error,result)=> {
        if(error){
            throw error
        }
        res.status(200).json("Registered succesfully")
    })
}) 


app.get('/getUsers', (req,res) => {    
    let query = "SELECT * from users ORDER BY user_id ASC";
    pool.query(query, (error,result)=> {
        if(error){
            throw error
        }
        res.status(200).json(result)
    })
})  


app.post('/user/detail', (req,res) => {
    console.log("profile call")
    let token =  req.body.token;
    let query = "SELECT * from users where token='"+token+"'";
    pool.query(query, (error,result)=> {
        if(error){
            throw error
        }
        res.status(200).json(result)
    })
}) 



app.get('/getSubjects', (request,res) => {
    pool.query('SELECT * FROM subjects ORDER BY subject_id ASC', function (error, results) {
    if (error) throw error;
    res.status(200).json(results)
    });
});