var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var commentSchema = require('./Comment').schema;

var teamSchema = new mongoose.Schema({
	name: String,
	id: Number,
	range: String,
	comments: [commentSchema]

});

var Team = mongoose.model('Team', teamSchema);
module.exports = Team;