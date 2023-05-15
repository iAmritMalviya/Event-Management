require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express()

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


const routes = require('./routes/index');
const BASE = '/api/v3/app'
app.use(BASE, routes.event) 

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server Has Started!");
});
 // npm i express body-parser mongoose dotenv ejs nodemon