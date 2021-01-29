//ActionController.js

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var authMiddleware = require('../authMiddleware');