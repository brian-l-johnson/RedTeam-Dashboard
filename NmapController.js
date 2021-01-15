var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var async = require("async");

var authMiddleware = require("./authMiddleware");

var EventPublisher = require('./EventPublisher');
const publisher = new EventPublisher();

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());
var Host = require('./schema/Host');
//var Team = require('./schema/team');
var mongoose = require('mongoose');
var Team = mongoose.model("Team");
//var Team = require('./schema/Team');
//var Port = require('./schema/Port');

router.post('/:team', authMiddleware.isAuthenticated(), authMiddleware.hasRole("hacker"), function(req, res) {
    var team = req.params.team;
    var teamName;
    var teamRange;
    console.log("in post handler")
    var nmapData = req.body;
    var seenHosts = {};


    Team.findById(req.params.team, function(err, t) {
        if(err) return console.log("failed to find team");
        if(!t) return res.status(404).send({error: "team not found"});
        this.teamName = t.name;
        this.teamRange = t.range;
        console.log(this.teamRange);

    })
    .then(function() {
        Host.find({state: "up", team: req.params.team}, "ip", function(err, hosts) { 
            console.log(hosts);
            for(i = 0; i< hosts.length; i++) {
                seenHosts[hosts[i]['ip']] = false;
            }
    
        })
        .then(function() {
            async.each(nmapData, function(host, callback) {
                Host.findOne({ip: host['ip']}, function(err, result) {
                    seenHosts[host['ip']] = true;
                    portMap = {};

                    if(result) {
                        console.log("found result for "+host['ip']);
                        if(result['openPorts']!== null) {
                            for(i=0; i<result['openPorts'].length; i++) {
                                portMap[result['openPorts'][i]['port']] = i;
                            }
                        }
                        if(result['state'] == "down") {
                            result['state'] = "up";
                            result['lastChanged'] = new Date();
                            
                            if(host['openPorts'] !== null) {
                                for(i=0; i<host['openPorts'].length; i++) {
                                    let portNum = host['openPorts'][i]['port'];
                                    console.log(portNum);
                                    if(portNum in portMap) {
                                        console.log("found port");
                                        publisher.handleEvent("port reopened", {"team": this.teamName, "ip": host.ip, "port": portNum});
                                        result['openPorts'][portMap[portNum]]['history'].push( {
                                            state: result['openPorts'][i]['state'],
                                            start: result["openPorts"][i]['lastChanged']
                                        });
                                        result['openPorts'][portMap[portNum]]['state'] = 'open';
                                        result['openPorts'][portMap[portNum]]['lastChanged'] = new Date();
                                        console.log("here");
                                    }
                                    else {
                                        console.log("did not find port");
                                        console.log(portMap);
                                        result['openPorts'].push(host['openPorts'][i]);
                                    }
                                }
                            }
                        }
                        else {
                            seenPorts = {};
                            if(result['openPorts'] !== null) {
                                for(i = 0; i<result['openPorts'].length; i++) {
                                    if(result['openPorts'][i]['state'] === "open") {
                                        seenPorts[result['openPorts'][i]['port']] = false;
                                    }
                                    
                                }
                            }
                            if(host['openPorts'] !== null) {
                                for(i = 0; i<host['openPorts'].length; i++) {
                                    if(host['openPorts'][i]['port'] in seenPorts) {
                                        console.log("port in last scan");
                                        
                                        if(result['openPorts'][portMap[host['openPorts'][i]["port"]]].state == "closed") {
                                            console.log("port reopend");
                                            publisher.handleEvent("port reopened", {"team": this.teamName, "ip": host['ip'], "port": host['openPorts'][i]['port']});

                                            result['openPorts'][portMap[host['openPorts'][i]["port"]]]['history'].push({
                                                state: result['openPorts'][portMap[host['openPorts'][i]["port"]]]['state'],
                                                start: result['openPorts'][portMap[host['openPorts'][i]["port"]]]['lastChanged']
                                            })
                                            result['openPorts'][portMap[host['openPorts'][i]["port"]]]['state'] = "open";
                                            result['openPorts'][portMap[host['openPorts'][i]["port"]]]['lastChanged'] = new Date();
                                        }

                                    }
                                    else {
                                        console.log("port not in last scan");
                                        result['openPorts'].push(host['openPorts'][i]);
                                        publisher.handleEvent("new port", {"team": this.teamName, "ip": host.ip, "port": host.openPorts[i].port});
                                    }
                                    seenPorts[host['openPorts'][i]['port']] = true;
                                }
                            }
    
                            for(var port in seenPorts) {
                                console.log(port+":"+seenPorts[port]);
                                if(seenPorts[port] == false) {
                                    console.log("port "+port+" missing from current scan");
                                    for(i = 0; i<result['openPorts'].length; i++) {
                                        if(result['openPorts'][i]['port'] == port) {
                                            
                                            result['openPorts'][i]["history"].push({
                                                state: result['openPorts'][i]['state'],
                                                start: result["openPorts"][i]['lastChanged']
                                            });
                                            result['openPorts'][i]['state'] = "closed";
                                            result['openPorts'][i]["lastChanged"] = new Date();
                                            console.log("setting state to closed");
                                            publisher.handleEvent("port closed", {"team": this.teamName, "ip": host['ip'], "port": port});
                                            break;
                                        }
                                    }   
                                }
                            }
                        }
                        
                        result.save();
                    }
                    else {
                        console.log("could not find result for "+host['ip']);
                        publisher.handleEvent("new host", {"team": this.teamName, "ip": host['ip']});
                        var newHost = new Host(host);
                        newHost['team'] = team;
                        if(newHost['openPorts'] === null) {
                            newHost['openPorts'] = [];
                        }
                        for(var i = 0; i < newHost['openPorts'].length; i++) {
                            publisher.handleEvent("new port", {"team": this.teamName, "ip": host.ip, "port": newHost['openPorts'][i].port});
                        }
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
                async.each(Object.keys(seenHosts), function(hostIP, callback2) {
                    if(seenHosts[hostIP] == false) {
                        console.log(hostIP+" missing from current scan");
                        publisher.handleEvent("host down", {"team": this.teamName, "ip": hostIP});
                        Host.findOne({ip: hostIP}, function(err, host) {
                            host['state'] = "down";
                            if(host['openPorts'] !== null) {
                                for(i = 0; i<host['openPorts'].length; i++) {
                                    host['openPorts'][i]['history'].push({
                                        state: host['openPorts'][i]['state'],
                                        start: host['openPorts'][i]['lastChanged']
                                    });
                                    host['openPorts'][i]['state'] = "closed";
                                    host['openPorts'][i]['lastChanged'] = new Date();
                                }
                            }
    
                            host['lastChanged'] = new Date();
                            host.save(function(err) {
                                if(err) throw err;
                                console.log("updated host as down");
                            });
                        })
                    }
                    callback2();
    
                }),
                function(err) {
                    console.log("done looking for missing hosts");
                    console.log("foo");
                }
                //res.status(200).send("ok");
            })
        })   
    })
    .then(function() {
        console.log("all done");
        res.status(200).send({status: "ok"});

        msg = {team: req.params.team,
            range: this.teamRange};
        console.log(JSON.stringify({team: req.params.team,
            range: this.teamRange}));
        publisher.handleEvent("scan complete", JSON.stringify(msg));
        //publisher.publishMessage(JSON.stringify(msg));
    });


});

module.exports = router;