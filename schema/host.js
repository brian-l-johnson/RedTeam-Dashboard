var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var commentSchema = require('./comment').schema;
var portSchema = require('./port').schema;

var hostSchema = new mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    hostname: String,
    ip: String,
    state: {type: String, default: "up"},
    lastChanged: {type: Date, default: Date.now},
    //firstSeen: {type: Date, default: Date.now},
    os: String,
    openPorts: [portSchema],
    comments: [commentSchema],
    team: mongoose.Schema.Types.ObjectId,
});

var Host = mongoose.model('Host', hostSchema);
module.exports = Host;
