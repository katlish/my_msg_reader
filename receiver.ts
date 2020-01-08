#!/usr/bin/env node
import * as Amqp from 'amqplib';





export class Receiver {
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

    async runRabbitAndAssertQ() {
        this.connection = await this.connectionToRabbit();
        this.channel = await this.createChannel();
        if (this.connection && this.channel) {
            this.isConnected = true;
            this.assertQ();
            console.log("rabbit connected and is running.")
        } else {
            console.log(`Connection failed => status of connections: connection = ${this.connection}, channel = ${this.channel}`);
        }
    }


    
    consume = (sendToSocket?: (msgFromRabbit: string) => any) => {
        if (this.isConnected === true) {
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", this.q);
    
            this.channel.consume(this.q, (msg: any) => {
                if(sendToSocket) {
                    sendToSocket(msg.content.toString());
                    console.log("sendToSocket is called and finished");
                }else{
                    console.log(`msg: ${msg.content.toString()}`);
                }
            }, {
                noAck: true // when true - receiver doesn't have any problems and is ready to receive. 
                                // when false - receiver has a problem and asks rabbit to store the message in its memory
            });
        }else{
            console.log(`rabbit failed to connect!`)
        }
    }
}

async function runReceiver() {
    const receiver = new Receiver("fromAtoB", "amqp://user:bitnami@localhost");
    await receiver.runRabbitAndAssertQ();
    receiver.consume();
}

runReceiver();