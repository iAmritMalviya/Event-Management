
const express = require("express");
const ejs = require("ejs"); // ejs, a server side rendering templete
const bodyParser = require("body-parser"); 
const cors = require('cors');
const app = express()

app.set("view engine", "ejs");
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }
 
 app.use(cors(corsOptions)) 

const routes = require('./routes/index');
const BASE = '/api/v3/app'
app.use(BASE, routes.event)  // defining routes in middlware

var port = process.env.PORT || 3000; 
app.listen(port, function () {
    console.log("Server Has Started!");
});