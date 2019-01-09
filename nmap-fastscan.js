var nmap = require('node-nmap');
var mongoose = require('mongoose');

var Host = require('./schema/host');

mongoose.connect('mongodb://localhost/ccdc', function (err) {
    if (err) throw err;
    console.log("successfully connected");
    }
);

nmap.nmapLocation = "nmap"

var nmapscan = new nmap.NmapScan('192.168.1.1-100');

nmapscan.on('complete', function(data) {
    console.log(JSON.stringify(data));
    for(var i = 0; i< data.length; i++) {
    	var host = new Host(data[i]);
    	/*
    	host.save(function(err) {
    		if(err) throw err;
    		console.log("saved host");
    	})
    	/*
    	var host = new Host({
    		_id: new mongoose.Types.ObjectId(),
    		ip: data[i].ip	
    	});
    	host.save(function(err) {
    		if(err) throw err;
    		console.log("saved host");
       	});
       	*/
        //console.log(JSON.stringify(data[i]));
    }
});

nmapscan.on('error', function(error) {
    console.log(error);
});

nmapscan.startScan();
