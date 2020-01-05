#!/usr/bin/env node
const amqp = require('amqplib/callback_api');

export class Sender {
    q: string;

    constructor(q: string) { 
        this.q = q; 
    }

    send = (msg: string) => {
        
        amqp.connect('amqp://user:bitnami@localhost', (error0, connection) => {
            if (error0) {
                console.log(error0);
                throw error0;
            }


            connection.createChannel((error1, channel) => {
                if (error1) {
                    throw error1;
                }
                
                channel.assertQueue(this.q, {
                    durable: false
                });
                
                channel.sendToQueue(this.q, Buffer.from(msg));
                
                console.log(`msg ${msg} sent to rabbitMQ`)
            });
            
            setTimeout(function() {
                console.log("in sender: before close");
                connection.close();
                console.log("in sender: after close");
                
            }, 500);
        });

    }
}






