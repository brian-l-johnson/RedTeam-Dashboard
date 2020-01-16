require('dotenv').config();

var mongoose = require('mongoose');

mongoose.connect(process.env.MONGOOSE_STRING);
//mongoose.connect('mongodb://localhost/ccdc');