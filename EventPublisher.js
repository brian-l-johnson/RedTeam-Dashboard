var amqp = require('amqplib/callback_api');
const { IncomingWebhook } = require('@slack/client');
const url = "https://hooks.slack.com/services/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";
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
                break;
            case "host up":
                console.log(type+":"+message);
                break;
            case "new port":
                console.log(type+":"+message);
                break;
            case "port down":
                console.log(type+":"+message);
                break;
            case "port up":
                console.log(type+":"+message);
                break;
            case "port down":
                console.log(type+":"+message);
                break;
            case "scan complete":
                console.log(type+":"+message);
                break;
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
                console.log("message seng");
            }
        }
        )
    }

    publishMessage(msg) {
        amqp.connect('amqp://localhost:32777', function(err, conn) {
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

