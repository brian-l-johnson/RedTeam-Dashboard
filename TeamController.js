//TeamController.js

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var authMiddleware = require('./authMiddleware.js');

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

var EventPublisher = require('./EventPublisher');
const publisher = new EventPublisher();

var Team = require('./schema/Team');
var Host = require('./schema/Host');
//const { default: Host } = require('./dashboard-frontend/src/Host.js');

/*
router.use(function(req, res, next) {
	if(req.session.authenticated) {
		next();
	}
	else{
		console.log("user is not logged in, sending 401")
		return res.status(401).send({"error": "not logged in"});	
	}
});
*/

router.post('/', authMiddleware.isAuthenticated(), authMiddleware.hasRole("hacker"), function(req, res) {
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
		publisher.handleEvent("new team", JSON.stringify({"team": team._id, "name": team.name, "range": team.range}));
		res.status(200).send(team);
	});
});

router.get('/', authMiddleware.isAuthenticated(), authMiddleware.hasRole("view"), function(req, res) {
	Team.find({}, function(err, teams) {
		if(err) return res.status(500).send("there was a problem finding the teams");
		res.status(200).send(teams);
	});
});

router.get('/:id', authMiddleware.isAuthenticated(), authMiddleware.hasRole("view"), function(req, res){
	Team.findById(req.params.id, function(err, team) {
		if(err) return res.status(300).send("There was a problem finding the team");
		if(!team) return res.status(404).send("no team found");
		res.status(200).send(team);
	});
});

router.delete('/:id', authMiddleware.isAuthenticated(), authMiddleware.hasRole('admin'), function(req, res) {
	console.log("in delete for id: "+req.params.id)
	Host.deleteMany({team: req.params.id}, function(err, hosts) {
		if(err) return res.status(500).send("there was a problem finding the hosts");
		console.log(hosts)

	});
	Team.findByIdAndRemove(req.params.id, function(err, team) {
		if(err) return res.status(500).send("THere was a problem finding the team");
		if(!team) return res.status(404).send("no team found");
		console.log("deleted!"+team)
		res.status(200).send(team);
	});

});

router.post('/:id/comments', authMiddleware.isAuthenticated(), authMiddleware.hasRole("hacker"), function(req, res) {
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
