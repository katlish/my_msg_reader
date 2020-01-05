#!/usr/bin/env node
const amqp = require('amqplib/callback_api');




export class Receiver {
    q: string;

    constructor(q: string) { 
        this.q = q; 
    }

    
    consume = (sendToSocket: (msgFromRabbit: string) => any) => {
        
        amqp.connect('amqp://user:bitnami@localhost', async (error0, connection) => {
            if (error0) {
                console.log(error0);
                throw error0;
            }

            // const channel = await new Promise((resolve, reject) => {
            //     connection.createChannel((error1, channel) => {
            //         if (error1) {
            //             reject(error1);
            //         }

            //         resolve(channel);
            //     })
            // });

            

            connection.createChannel((error1, channel) => {
                if (error1) {
                    throw error1;
                }
                
                channel.assertQueue(this.q, {
                    durable: false
                });

                console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", this.q);

                channel.consume(this.q, (msg) => {
                    sendToSocket(msg.content.toString());
                    console.log("sendToSocket is called and finished");
                }, {
                    noAck: true // when true - receiver doesn't have any problems and is ready to receive. 
                                    // when false - receiver has a problem and asks rabbit to store the message in its memory
                });
            });
            
            
        });
    }
}
