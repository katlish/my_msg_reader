#!/usr/bin/env node
import * as Amqp from 'amqplib';





export class Receiver {
    exchange: string;
    credentials: string;
    connection: any;
    channel: any;
    isConnected: boolean;


    constructor(exchange: string, credentials: string) { 
        this.exchange = exchange; 
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

    private assertEx = () : void => {
        // this.channel.assertQueue(this.q, {
        //     durable: false
        // });
        // console.log("q asserted.")
        this.channel.assertExchange(this.exchange, 'direct', {
            durable: false
        });
        console.log("exchange asserted.")
    }

    private assertAndBindToQ = (q: string) : void => {
        this.channel.assertQueue(q);
        this.channel.bindQueue(q, this.exchange, q);
        console.log("q asserted and bound.")
    }

    async runRabbitAndAssertExchange() {
        this.connection = await this.connectionToRabbit();
        this.channel = await this.createChannel();
        if (this.connection && this.channel) {
            this.assertEx();
            this.isConnected = true;
            console.log("rabbit connected and exchange is asserted.")
        } else {
            console.log(`Connection failed => status of connections: connection = ${this.connection}, channel = ${this.channel}`);
        }
    }


    
    consume = (bindingKey: string, sendToSocket?: (msgFromRabbit: string) => any) => {
        if (this.isConnected === true) {
            this.assertAndBindToQ(bindingKey);
            console.log(" [*] Waiting for messages in exchange %s. To exit press CTRL+C", this.exchange);
            this.channel.consume(bindingKey, (msg: any) => {
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

// async function runReceiver() {
//     const receiver = new Receiver("exchange", "amqp://user:bitnami@localhost");
//     await receiver.runRabbitAndAssertExchange();
//     receiver.consume("fromAtoB");
// }

// runReceiver();