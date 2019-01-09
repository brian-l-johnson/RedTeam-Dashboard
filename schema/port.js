var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var commentSchema = require('./comment').schema;
var portHistorySchema = require('./porthistory').schema;

var portSchema = mongoose.Schema({
	port: Number,
	state: {type: String, default: "open"},
	protocol: String,
	service: String,
	method: String,
	history: [portHistorySchema],
	comments: [commentSchema],
	hacked: {type: Boolean, default: false},
	lastChanged: {type: Date, default: Date.now}

});

var Port = mongoose.model('Port', portSchema);
module.exports = Port;