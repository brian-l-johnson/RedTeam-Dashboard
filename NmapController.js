var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var async = require("async");

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());
var Host = require('./schema/Host');
//var Port = require('./schema/Port');

router.post('/', function(req, res) {
    console.log("in post handler")
    var nmapData = req.body;
    var seenHosts = {};

    Host.find({}, "ip", function(err, hosts) { 
        console.log(hosts);
        for(i = 0; i< hosts.length; i++) {
            seenHosts[hosts[i]['ip']] = false;
        }

    })
    .then(function() {
        async.each(nmapData, function(host, callback) {
            Host.findOne({ip: host['ip']}, function(err, result) {
                seenHosts[host['ip']] = true;
                if(result) {
                    console.log("found result for "+host['ip']);
                    seenPorts = {};
                    for(i = 0; i<result['openPorts'].length; i++) {
                        seenPorts[result['openPorts'][i]['port']] = false;
                    }
                    for(i = 0; i<host['openPorts'].length; i++) {
                        if(host['openPorts'][i]['port'] in seenPorts) {
                            console.log("port in last scan");
                        }
                        else {
                            console.log("port not in last scan");
                            result['openPorts'].push(host['openPorts'][i]);
                        }
                        seenPorts[host['openPorts'][i]['port']] = true;
                    }
                    for(var port in seenPorts) {
                        console.log(port+":"+seenPorts[port]);
                        
                        if(seenPorts[port] == false) {
                            console.log("port "+port+" missing from current scan");
                            for(i = 0; i<result['openPorts'].length; i++) {
                                if(result['openPorts'][i]['port'] == port) {
                                    result['openPorts'][i]['state'] = "closed";
                                    result['openPorts'][i]["history"].push({
                                        state: "open",
                                        start: result["openPorts"][i]['lastChanged']
                                    });
                                    result['openPorts'][i]["lastChanged"] = new Date();
                                    console.log("setting state to closed");
                                    break;
                                }
                            }
                            
                        }
                        
                    }
                    result.save();
                }
                else {
                    console.log("could not find result for "+host['ip']);
                    var newHost = new Host(host);
                    newHost.save(function(err) {
                        if(err) throw err;
                        console.log("saved host");
                       });
                }
                callback();
            })
        },
        function(err, results) {
            console.log(seenHosts);
            res.status(200).send("ok");
        })
    });


});

module.exports = router;