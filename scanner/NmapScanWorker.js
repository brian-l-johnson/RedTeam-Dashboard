#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
var nmap = require('node-nmap');
const axios = require('axios').default;
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');

axiosCookieJarSupport(axios);

const cookieJar = new tough.CookieJar();
axios.defaults.jar = cookieJar;
axios.defaults.withCredentials = true;

nmap.nmapLocation = "nmap"

doWebAuth().then(function(data) {
    console.log("got "+data);
});

amqp.connect('amqp://localhost:32771', function(err, conn) {
    conn.createChannel(function(err, ch) {
        var q = 'nmap-scan';

        ch.assertQueue(q, {durable: false});
        ch.prefetch(1);
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
        ch.consume(q, function(msg) {
            //var secs = msg.content.toString().split('.').length - 1;
            //console.log(msg);
            console.log(" [x] Received %s", msg.content.toString());

            msgJson = JSON.parse(msg.content.toString());
            console.log(msgJson);
            console.log(msgJson.team);
            console.log(msgJson.range);

            var nmapscan = new nmap.NmapScan(msgJson.range, '');

            nmapscan.on('complete', function(data) {
                console.log(JSON.stringify(data));
                axios.post('http://127.0.0.1:3001/nmap/'+msgJson.team, data)
                .then(function(resp) {
                    console.log(resp.data);
                    ch.ack(msg);
                })
                
            });
            
            nmapscan.on('error', function(error) {
                console.log(error);
            });
            
            nmapscan.startScan();

        });
    }, {noAck: false});
});


function doWebAuth() {
        const request = axios.post('http://127.0.0.1:3001/auth/login', {
            "email": "brian.l.johnson@gmail.com",
            "password": "foobar"
        });

        request
        .then(function(response) {
            console.log(response.data);
            console.log(cookieJar);
            axios.get('http://127.0.0.1:3001/auth/permissions')
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