#!/usr/bin/env node
// const amqp = require('amqplib/callback_api');
import * as Amqp from 'amqplib';

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
    isConnected: boolean;


    constructor(q: string, credentials: string) { 
        this.q = q; 
        this.credentials = credentials;
        this.isConnected = false;
    }

    private async connectionToRabbit() : Promise<any> {
        const connection = await Amqp.connect(this.credentials);
        console.log(`connection created: ${connection}`)
        return connection;
    }

    private async createChannel() : Promise<any> {
        const channel = await this.connection.createChannel();
        console.log("channel created.")
        return channel;
    }

    private assertQ = () : void => {
        this.channel.assertQueue(this.q, {
            durable: false
        });
        console.log("q asserted.")
    }

    async runRabbitAndAssertQ() : Promise<boolean> {
        this.connection = await this.connectionToRabbit();
        this.channel = await this.createChannel();
        if (this.connection && this.channel) {
            this.isConnected = true;
            this.assertQ();
            console.log("rabbit connected and is running.")
        }
        console.log(`isConnected = ${this.isConnected}`);

        return this.isConnected;
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
            
                
        // });

    }
}

// async function isRunning(sender: Sender) : Promise<boolean> {
//     return await sender.runRabbitAndAssertQ();
// } 
async function runSender() {
    const sender = new Sender("fromAtoB", "amqp://user:bitnami@localhost");
    await sender.runRabbitAndAssertQ() ? sender.send("bla") : console.log(`isRun = false`)
}

runSender();



