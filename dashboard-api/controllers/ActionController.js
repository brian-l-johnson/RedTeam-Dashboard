//ActionController.js
var async = require('async');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var authMiddleware = require('../authMiddleware');
var Action = require('../schema/Action');
var Vulnerability = require('../schema/Vulnerability');
var Host = require('../schema/Host');
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

router.post('/', authMiddleware.isAuthenticated(), authMiddleware.hasRole("hacker"), function(req, res) {
	console.log(req.body);
	let vulnRefs = [];
	async.each(req.body.vulnerabilities, function(vuln, callback) {
		console.log(vuln);
		Host.findOne({ip: vuln.host}, async function(err, host) {
			if(err) return res.status(500).send("{'error': 'There was a problem finding the host'}");
			if(!host) return res.status(404).send("{error: 'no team found'}");
			for(var i = 0; i<host.openPorts.length; i++) {
				if(host.openPorts[i].port == vuln.port) {
					let newVuln = await Vulnerability.create({
						vulnerabilities: req.body.description,
						nores: vuln.notes,
						severity: vuln.severity,
						user: req.session.user.handle
					})
					console.log(newVuln);
					host.openPorts[i].vulnerabilities.push(newVuln);
					host.save()
					vulnRefs.push({ip: vuln.host,
								   port: vuln.port,
								   id: newVuln._id
								});
					callback();
					return 
				}
			}
		});
	},
	function(err) {
		console.log("in callback????");
		console.log(vulnRefs);
		if(err) {
			console.log(err);
			return res.status(500).send("error")
		}
		else {
			let newAction = Action.create({hacker: req.session.user.handle,
										   description: req.body.description,
										   vulnerabilities: vulnRefs}, 
							function(err, action) {
								if(err) {
									return res.status(500).send(err);
								}
								console.log(action);
								return res.status(200).send(action);


			})
		}
	});

	
	/*let vulnIds = req.body.vulnerabilities.map(async vuln => {
		await Host.findOne({ip: vuln.host}, async function(err, host) {
			if(err) return res.status(500).send("{'error': 'There was a problem finding the host'}");
			if(!host) return res.status(404).send("{error: 'no team found'}");
			for(var i = 0; i<host.openPorts.length; i++) {
				let vulnId = ""
				if(host.openPorts[i].port == vuln.port) {
					let newVuln =await Vulnerability.create({
						vulnerabilities: req.body.description,
						nores: vuln.notes,
						severity: vuln.severity,
						user: req.session.user.handle
					})
					console.log(newVuln);
					host.openPorts[i].vulnerabilities.push(newVuln);
					host.save()
					vulnId = newVuln._id;
					return 
				}
			}
			return {ip: vuln.host,
				port: vuln.port,
				id: newVuln._id}

		})
	})
	Promise.all(vulnIds).then(values => {
		console.log(values)
	});
	
	res.status(200).send("ok");
	/*
	
	Action.create({
		hacker : req.body.hacker,
        description : req.body.description,
        vulnerabilities: req.body.vulnerabilities
	},
	function(err, action) {
		if (err) {
			console.log(err);
			return res.status(500).send("There was a problem adding the information to the database");
		}
		res.status(200).send(action);
	});
	*/
});

router.get('/', authMiddleware.isAuthenticated(), authMiddleware.hasRole("viewer"), function(req, res) {
    Action.find({}, function(err, actions) {
        if(err) {
            return res.status(500).send("error retrieving actions");
        }
        return res.status(200).send(actions);
    });
});


module.exports = router;