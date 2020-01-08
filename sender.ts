#!/usr/bin/env node
const amqp = require('amqplib/callback_api');

// "amqp://user:bitnami@localhost"
//FIXME: store all the vars in members, call to functions in the constructor 
//TODO: how to catch errors in constructor?
//TODO: create a function to establish all the infrastructure that will be called in the constructor
//FIXME: types of the connection, channel

export class Sender {
    q: string;
    credentials: string;
    connection: any;
    channel: any;


    constructor(q: string, credentials: string) { 
        this.q = q; 
        this.credentials = credentials;

        this.runRabbitAndAssertQ();
    }

    private connectionToRabbit = () : any => {
        const connection = amqp.connect(this.credentials, (error0, connection) => {
            if (error0) {
                console.log(error0);
                throw error0;
            }
            return connection;
        })
        return connection;
    }

    private createChannel = () : any => {
        const channel = this.connection.createChannel((error1, channel) => {
            if (error1) {
                throw error1;
            }
            return channel;
        })
        return channel;
    }

    private assertQ = () : void => {
        this.createChannel().assertQueue(this.q, {
            durable: false
        });
    }

    runRabbitAndAssertQ = () => {
        this.connectionToRabbit();
        this.createChannel();
        this.assertQ();
    }

    send = (msg: string) => {
        
        // amqp.connect('amqp://user:bitnami@localhost', (error0, connection) => {
        //     if (error0) {
        //         console.log(error0);
        //         throw error0;
        //     }


            // connection.createChannel((error1, channel) => {
            //     if (error1) {
            //         throw error1;
            //     }
                
                // channel.assertQueue(this.q, {
                //     durable: false
                // });
                
                this.channel.sendToQueue(this.q, Buffer.from(msg));
                
                console.log(`msg ${msg} sent to rabbitMQ`)
            // });
            
        //     setTimeout(function() {
        //         console.log("in sender: before close");
        //         connection.close();
        //         console.log("in sender: after close");
                
        //     }, 500);
        // });

    }
}






