var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var commentSchema = require('./comment').schema;

var teamSchema = new mongoose.Schema({
	name: String,
	comments: [commentSchema]

});

var Team = mongoose.model('Team', teamSchema);
module.exports = Team;