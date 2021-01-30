//app.js

var express = require('express');
var compression = require('compression');

var app = express();
const path = require('path');

require('dotenv').config();

console.log(process.env.ALLOWED_CORS_ORIGINS);

var db = require('./db');
//var mongoose = require('mongoose');
//mongoose.connect(process.env.MONGOOSE_STRING);

var HostController = require('./controllers/HostController');
var TeamController = require('./controllers/TeamController');
var NmapController = require('./controllers/NmapController');
var VulnerabilityController = require('./controllers/VulnerabilityController');
var AuthController = require('./controllers/AuthController');
var ExploitController = require('./controllers/ExploitController');
var ActionController = require('./controllers/ActionController');

var session = require('express-session');
var FileStore = require('session-file-store')(session);
app.use(session({
  name: 'sessionid',
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true,
  resave: true,
  store: new FileStore()
}));

app.use(compression()); 

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function(req, res) {
  console.log("in static handler");
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use(function(req, res, next) {
  let origin = req.get('origin');
  let allowedOrigns = process.env.ALLOWED_CORS_ORIGINS.split(",");
  console.log("allowed origins: "+allowedOrigns);
  if(allowedOrigns.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT");
    res.header("Access-Control-Allow-Credentials", "true");  
  }
  next();
});


app.use('/hosts', HostController);
app.use('/teams', TeamController);
app.use('/nmap', NmapController);
app.use('/vulnerability', VulnerabilityController);
app.use('/auth', AuthController);
app.use('/exploit', ExploitController);
app.use('/actions', ActionController);

module.exports = app;