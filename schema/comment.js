var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new mongoose.Schema({
	text: String,
	date: {type: Date, default: Date.now},
	user: String

});

var Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;