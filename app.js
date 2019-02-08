//app.js

var express = require('express');
var compression = require('compression');

var app = express();
const path = require('path');

var db = require('./db');

require('dotenv').config();

var HostController = require('./HostController');
var TeamController = require('./TeamController');
var NmapController = require('./NmapController');
var VulnerabilityController = require('./VulnerabilityController');
var AuthController = require('./AuthController');

var session = require('express-session');
var FileStore = require('session-file-store')(session);
app.use(session({
  name: 'sessionid',
  secret: 'DhcBgTRUtH4OoVMZYfOS6Y9YZSwLgy',
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
  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use('/hosts', HostController);
app.use('/teams', TeamController);
app.use('/nmap', NmapController);
app.use('/vulnerability', VulnerabilityController);
app.use('/auth', AuthController);

module.exports = app;