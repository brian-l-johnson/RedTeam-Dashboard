var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var portHistorySchema = new mongoose.Schema({
    state: String,
    start: {type: Date},
	end: {type: Date, default: Date.now},
});

var Comment = mongoose.model('PortHistory', portHistorySchema);
module.exports = Comment;