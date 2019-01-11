var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var historySchema = new mongoose.Schema({
    state: String,
    start: {type: Date},
	end: {type: Date, default: Date.now},
});

var Comment = mongoose.model('History', historySchema);
module.exports = Comment;