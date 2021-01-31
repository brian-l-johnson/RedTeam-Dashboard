//ActionController.js

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var authMiddleware = require('../authMiddleware');
var Action = require('../schema/Action');
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

router.post('/', authMiddleware.isAuthenticated(), authMiddleware.hasRole("hacker"), function(req, res) {
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