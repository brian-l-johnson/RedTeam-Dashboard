//app.js

var express = require('express');
var app = express();
var db = require('./db');


var HostController = require('./HostController');
var TeamController = require('./TeamController');
var NmapController = require('./NmapController');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/hosts', HostController);
app.use('/teams', TeamController);
app.use('/nmap', NmapController);

module.exports = app;