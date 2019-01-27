var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
	email: String,
	password: String,
	handle: String,
	active: {type: Boolean, default: false},
	permissions: [String]

});

var User = mongoose.model('User', userSchema);
module.exports = User;