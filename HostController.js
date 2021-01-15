//HostController.js

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());
var Host = require('./schema/Host');
var authMiddleware = require('./authMiddleware');

router.post('/', authMiddleware.isAuthenticated(), authMiddleware.hasRole("hacker"), function(req, res) {
	console.log("in post handler")
	console.log("ip is: "+ req.body.ip);
	Host.create({
		ip : req.body.ip
	},
	function(err, host) {
		if (err) {
			console.log(err);
			return res.status(500).send("There was a problem adding the information to the database");
		}
		res.status(200).send(host);
	});
});

router.get('/', authMiddleware.isAuthenticated(), authMiddleware.hasRole('view'), function(req, res) {
	Host.find({}, function(err, hosts) {
		if(err) return res.status(500).send("there was a problem finding the hosts");
		res.status(200).send(hosts);
	});
});

router.get('/team/:team', authMiddleware.isAuthenticated(), authMiddleware.hasRole('view'), function(req, res) {
	Host.find({team: req.params.team}, function(err, hosts) {
		if(err) return res.status(500).send("there was a problem finding the hosts");
		res.status(200).send(hosts);
	});
})

router.get('/:ip', authMiddleware.isAuthenticated(), authMiddleware.hasRole('view'), function(req, res){
	Host.findOne({ip: req.params.ip}, function(err, host) {
		if(err) return res.status(300).send("There was a problem finding the host");
		if(!host) return res.status(404).send("no host found");
		res.status(200).send(host);
	});
}) ;

router.get('/port/:port', authMiddleware.isAuthenticated(), authMiddleware.hasRole('view'), function(req, res) {
	Host.find({"openPorts.port": req.params.port}, function(err, hosts) {
		if(err) return res.status(500).send("database error");
		if(!hosts) return res.status(404).send("not found");
		filteredHosts = hosts.map(function(host) {
			host.openPorts = host.openPorts.filter(port => port.port == req.params.port);
			return host;

		})
		res.status(200).send(filteredHosts);
	})
});

router.post('/:ip/comments', authMiddleware.isAuthenticated(), authMiddleware.hasRole('hacker'), function(req, res) {
	Host.findOne({ip: req.params.ip}, function(err, host) {
		if(err) return res.status(300).send("There was a problem finding the host");
		if(!host) return res.status(404).send("no team found");
		host.comments.push({text: req.body.text,
							user: req.session.user.handle });
		host.save();
		res.status(200).send(host);
	});
});

module.exports = router;

