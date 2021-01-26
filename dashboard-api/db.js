require('dotenv').config();

var mongoose = require('mongoose');

mongoose.connect(process.env.MONGOOSE_STRING, {
    useNewUrlParser: true,
    reconnectTries : 100,
    reconnectInterval: 1000,
    autoReconnect : true
  });
//mongoose.connect('mongodb://localhost/ccdc');