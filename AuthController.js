//AuthController.js

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

const bcrypt = require("bcrypt");
const saltRounds = 10;

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());
var User = require('./schema/User');

var authMiddleware = require('./authMiddleware');

router.get('/permissions', authMiddleware.isAuthenticated(), function(req, res) {
	return res.status(200).send(req.session.user.permissions);
});

router.get('/logout', function(req, res) {
	req.session.regenerate(function(err) {
		if(err) return res.status(500).send({error: "failed to destroy session"});
		req.session.user = null;
		req.session.authenticated = false;
		console.log("logging out");
		return(res.status(200).send({"status": "logged out"}));
	})
});

router.get('/users', authMiddleware.isAuthenticated(), authMiddleware.hasRole("admin"), function(req, res) {
	if(req.session.authenticated) {
		User.find({}, function(err, users) {
			if(err) return res.status(500).send({error: "unable to retrieve users"});
			filteredUsers = users.map(function (user) {
				var u = JSON.parse(JSON.stringify(user));
				delete u.password;
				return u;
			})
			return res.status(200).send(filteredUsers);
		});
	}
	else {
		return res.status(401).send({error: "not logged in"});
	}
	
});

router.put('/user/:id', authMiddleware.isAuthenticated(), authMiddleware.hasRole('admin'), function(req, res) {
	User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function(err, user) {
		if(err) return res.status(500).send({"error": "could not update user"});
		else return res.status(200).send({"status": "updated user"});
	})
});

router.post('/register', function(req, res) {
	User.find({email: req.body.email}, function(err, docs) {
		if(err) res.status(500).send({"error": "database error"});
		if(docs.length > 0) {
			return res.status("400").send({"error": "user already exists"});
		}
		bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
			if(err) {
				return res.status(500).send({"error": "unable to hash password"});
			}
			User.create({
				email: req.body.email, 
				password: hash,
				handle: req.body.handle
			},
			function(err, user){
				if(err) {
					return res.status(500).send({"error": "could not create user"});
				}
			})
			res.status(200).send({"status": "ok"});
		});

	})
});

router.post('/login', function(req, res) {
	User.findOne({email: req.body.email}, function(err, user) {
		if(err) return res.staus(500).send({"error": "database error"});
		if(!user) {
			console.log("user does not exist");
			return res.status(401).send({"error": "authentication failure"}) // timing attack for valid account determination possible here
		}
		bcrypt.compare(req.body.password, user.password, function(err, match) {
			if(err) return res.status(500).send({"error": "hash failure"});
			if(match) {
				req.session.regenerate(function(err) {
					if(err) return res.status(500).send({"error": "failed to regenerate session"});
					req.session.user = user;
					req.session.authenticated = true;
					return res.status(200).send({"status": "logged in1",
												  "user": user.handle});
				})
				
			}
			else {
				return res.status(401).send({"error": "authentication failure"});
			}
		});

	});
})


module.exports = router;