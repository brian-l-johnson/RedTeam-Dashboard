#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
var nmap = require('node-nmap');
const axios = require('axios').default;
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');


require('dotenv').config();


var sync = require('child_process').spawnSync;

const ipBlackList = ['10.0.0.0',
                     '10.0.0.44',
                    ];



axiosCookieJarSupport(axios);

const cookieJar = new tough.CookieJar();
axios.defaults.jar = cookieJar;
axios.defaults.withCredentials = true;

nmap.nmapLocation = "nmap"

/*
doWebAuth().then(function(data) {
    console.log("got "+data);
});
*/

amqp.connect('amqp://127.0.0.1:5672', function(err, conn) {
    conn.createChannel(function(err, ch) {
        var q = 'nmap-scan';

        ch.assertQueue(q, {durable: false});
        ch.prefetch(1);
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
        ch.consume(q, function(msg) {
            //var secs = msg.content.toString().split('.').length - 1;
            //console.log(msg);
            //ip = randomIP();
            //sync('ifconfig', ['eth0:0', ip]);
            console.log(" [x] Received %s", msg.content.toString());

            msgJson = JSON.parse(msg.content.toString());
            console.log(msgJson);
            console.log(msgJson.team);
            console.log(msgJson.range);

            var nmapscan = new nmap.NmapScan(msgJson.range)//, '-e eth0 -S '+ip);

            nmapscan.on('complete', function(data) {
                console.log(JSON.stringify(data));
                axios.get(process.env.DASHBOARD_URL+'/auth/permissions')
                .then(function(resp) {
                    console.log(resp.status)
                })
                .catch(function(error) {
                    console.log("in catch, trying to login");
                    const loginReq = axios.post(process.env.DASHBOARD_URL+'/auth/login', {
                        "email": process.env.DASHBOARD_USER,
                        "password": process.env.DASHBOARD_PASS
                    });
                    loginReq
                    .then(function(response) {
                        console.log(response.status);
                        console.log("login successful");
                    })
                    .catch(function(error) {
                        console.log("Login failed");
                        process.exit(1);
                    });

                    return loginReq;
                })
                .then(function() {
                    console.log("about to post results");
                    axios.post(process.env.DASHBOARD_URL+'/nmap/'+msgJson.team, data)
                    .then(function(resp) {
                        console.log(resp.data);
                        if(resp.status === 200) {
                            ch.ack(msg);
                        }
                        else {
                            process.exit(1);
                        }
                        
                    })
                    .catch(function(error) {
                        console.log(error);
                        console.log("failed tp upload scan results");
                        process.exit(1);
                    })
                } )                
            });
            
            nmapscan.on('error', function(error) {
                console.log(error);
            });
            
            nmapscan.startScan();

        });
    }, {noAck: false});
});

function randomIP() {
    while(ip = "10."+Math.floor(Math.random() * 255)+"."+Math.floor(Math.random() * 255)+"."+Math.floor(Math.random() * 255)) {
        if(!ipBlackList.includes(ip)) {
            return ip;
        }
    }
}


function doWebAuth() {
        const request = axios.post(process.env.DASHBOARD_URL+'/auth/login', {
            "email": process.env.DASHBOARD_USER,
            "password": process.env.DASHBOARD_PASS
        });

        request
        .then(function(response) {
            console.log(response.data);
            console.log(cookieJar);
            axios.get(process.env.DASHBOARD_URL+'/auth/permissions')
            .then(function(resp) {
                console.log(resp.data);
                return resp.data;
            })
            .catch(function(err) {
                console.log(err);
            })
        })
        .catch(function(error) {
            console.log(error);
        })

        return request;
}