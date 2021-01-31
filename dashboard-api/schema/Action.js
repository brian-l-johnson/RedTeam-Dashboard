var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var vulnerabilityReferenceSchema = require('./VulnerabilityReference').schema;


var actionSchema = new mongoose.Schema({
	date: {type: Date, default: Date.now},
	hacker: String,
	description: String,
	vulnerabilities: [vulnerabilityReferenceSchema]
});

var Action = mongoose.model('Action', actionSchema);
module.exports = Action;