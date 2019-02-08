var app = require('./app');
var port = process.env.PORT || 3001;

const http = require('http');
const https = require('https');

const httpServer = http.createServer(app);
const httpsServer = https.createServer(app);




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