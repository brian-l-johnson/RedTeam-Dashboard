//TeamController.js

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

var Team = require('./schema/team');


router.use(function(req, res, next) {
	if(req.session.authenticated) {
		next();
	}
	else{
		console.log("user is not logged in, sending 401")
		return res.status(401).send({"error": "not logged in"});	
	}
});

router.post('/', function(req, res) {
	console.log("in post handler")
	console.log("ip is: "+ req.body.ip);
	Team.create({
		name : req.body.name,
		range : req.body.range
	},
	function(err, team) {
		if (err) {
			console.log(err);
			return res.status(500).send("There was a problem adding the information to the database");
		}
		res.status(200).send(team);
	});
});

router.get('/', function(req, res) {
	Team.find({}, function(err, teams) {
		if(err) return res.status(500).send("there was a problem finding the teams");
		res.status(200).send(teams);
	});
});

router.get('/:id', function(req, res){
	Team.findById(req.params.id, function(err, team) {
		if(err) return res.status(300).send("There was a problem finding the team");
		if(!team) return res.status(404).send("no team found");
		res.status(200).send(team);
	});
});

router.post('/:id/comments', function(req, res) {
	Team.findById(req.params.id, function(err, team) {
		if(err) return res.status(300).send("There was a problem finding the team");
		if(!team) return res.status(404).send("no team found");
		team.comments.push({text: req.body.text,
							user: req.body.user });
		team.save();
		res.status(200).send(team);
	});
});

module.exports = router;
