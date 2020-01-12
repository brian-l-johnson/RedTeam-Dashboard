var amqp = require('amqplib/callback_api');
const { IncomingWebhook } = require('@slack/client');
const url = process.env.SLACK_WEBHOOK;
const webhook = new IncomingWebhook(url);

module.exports = class EventPublisher {
    constructor() {
        this.foo ="bar";
    }

    handleEvent(type, message) {
        switch(type) {
            case "new host":
                console.log(type+":"+message);
                this.sendSlackMessage("new host for team: "+message.team+" with IP "+message.ip);
                break;
            case "host down":
                console.log(type+":"+message);
                this.sendSlackMessage("host "+message.ip+" down for teams: "+message.team);
                break;
            case "host up":
                console.log(type+":"+message);
                break;
            case "new port":
                console.log(type+":"+message);
                this.sendSlackMessage("port "+message.port+" opened for team: "+message.team+" on "+message.ip);
                break;
            case "port closed":
                console.log(type+":"+message);
                this.sendSlackMessage("port "+message.port+" closed for team: "+message.team+" on "+message.ip);
                break;
            case "port reopened":
                console.log(type+":"+message);
                this.sendSlackMessage("port "+message.port+" reopened for team: "+message.team+" on "+message.ip);
                break;
            case "port down":
                console.log(type+":"+message);
                break;
            case "scan complete":
                console.log(type+":"+message);
                this.sendSlackMessage("nmap scan complete against team "+message.team);
                this.publishMessage(message);
                break;
            case "new team":
                console.log(type+":"+message);
                this.publishMessage(message);
            case "exploit":
                console.log(type+":"+message);
                break
        }
    }

    sendSlackMessage(msg) {
        webhook.send(msg, function(err,res) {
            if(err) {
                console.log("Error:", err);
            }
            else {
                console.log("message sent");
            }
        }
        )
    }

    publishMessage(msg) {
        amqp.connect(process.env.RABBIT_STRING, function(err, conn) {
            if(err) {
                console.log(err);
            }
            conn.createChannel(function(err, ch) {
                ch.assertQueue("nmap-scan", {durable: false});
                ch.sendToQueue("nmap-scan", new Buffer(msg));
                console.log("[x] sent "+msg);
            });
            setTimeout(function() {conn.close()}, 500);
        })
        
    }
}

