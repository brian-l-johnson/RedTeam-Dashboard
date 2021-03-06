var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var commentSchema = require('./Comment').schema;
var historySchema = require('./Porthistory').schema;
var vulnerabilitySchema = require('./Vulnerability').schema;

var portSchema = mongoose.Schema({
	port: Number,
	state: {type: String, default: "open"},
	protocol: String,
	service: String,
	method: String,
	history: [historySchema],
	comments: [commentSchema],
	vulnerabilities: [vulnerabilitySchema],
	hacked: {type: Boolean, default: false},
	lastChanged: {type: Date, default: Date.now}

});

var Port = mongoose.model('Port', portSchema);
module.exports = Port;