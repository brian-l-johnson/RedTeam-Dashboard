var app = require('./app');
var port = process.env.PORT || 3001;

const http = require('http');
const https = require('https');

const httpServer = http.createServer(app);
const httpsServer = https.createServer(app);

const bcrypt = require("bcrypt");
const saltRounds = 10;
var User = require('./schema/User');
const cRandomString = require('crypto-random-string');


User.find({}, function(err, docs) {
	if(err) {
		console.error("could not read users");
		process.exit(10);
	}
	else {
		if(docs.length == 0) {
			console.warn('\x1b[31m%s\x1b[0m', "No users exist, creating admin user");
			password = cRandomString({length: 16})
			bcrypt.hash(password, saltRounds, function(err, hash) {
				if(err) {
					console.error("could not hash password, no way to continue");
					process.exit(100);
				}
				User.create({
					email: "admin@local",
					password: hash,
					hanble: 'admin',
					permissions: ['admin', 'view', 'hacker', 'scanner']}, 
					function(err, user) {
						if(err) {
							console.error("could not create user, no way to continue");
							process.exit(100);
						}
						console.log('\x1b[31m%s\x1b[0m', "created user 'admin@local' with password '"+password+"'");
					}
				);
			});
		}
	}
	
})

if(process.env.HTTPS) {
	// Certificate
	const privateKey = fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/privkey.pem', 'utf8');
	const certificate = fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/cert.pem', 'utf8');
	const ca = fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/chain.pem', 'utf8');

	const credentials = {
		key: privateKey,
		cert: certificate,
		ca: ca
	};	

	httpsServer.listen(port, () => {
		console.log("HTTPS Server listening on port "+port);
	});
}
else {
	httpServer.listen(port, () => {
		console.log("HTTP Server listening on port "+port)
	})
}



/*
var server = app.listen(port, function() {
	console.log("Express server lisening on port " + port);
});

*/