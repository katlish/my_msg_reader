//FIXME: use import instead of require
const express = require('express');
const app = express();
const io = require('socket.io');

import { Socket } from 'socket.io';
import { Server } from 'net';
import { RabbitMQReader } from './rabbitmq-reader';


export class MessageReader {
    port: number;
    routingKey: string;
    bindingKey: string;
    server: Server;
    socketIO: Socket;
    exchange: string;
    credentialsOfRabbit: string;

    constructor(port: number, exchange: string, credentialsOfRabbit: string, routingKey: string, bindingKey: string) { 
        this.port = port; 
        this.exchange = exchange;
        this.credentialsOfRabbit = credentialsOfRabbit;
        this.routingKey = routingKey;
        this.bindingKey = bindingKey; 
        
      

        //TODO: why can't write this request outside the constructor?
        this.server = require('http').createServer(app);
        this.socketIO = io(this.server);

        //TODO: how to extract the routs from this class?
        app.get('/', function(req: any, res: any){
        res.sendFile(__dirname + '/index.html');
        });
    }

    private  sendToSocket = (msgFromRabbit: string) : void => {
        console.log(`in sendToSocket message is ${msgFromRabbit}`);
        this.socketIO.emit('chat message', msgFromRabbit);  
        console.log("Msg sent to io");
    }

    async run () {
        
      
        this.server.listen(this.port, () => {
          console.log(`Server is listening on ${this.port}`);
        });
      
        const rabbitReader = new RabbitMQReader(this.exchange, this.credentialsOfRabbit);
        await rabbitReader.runRabbitAndAssertExchange();

        this.socketIO.on('connection', (socket) => {
            console.log('a user connected');
            socket.on('disconnect', () => {
              console.log('user disconnected');
            });
            
            rabbitReader.consumeFromRabbit(this.bindingKey, this.sendToSocket);
            
            socket.on('chat message', (msg: any) => {
                this.socketIO.emit('chat message', msg)
                rabbitReader.sendToRabbit(msg, this.routingKey);
            });
            
          });
          
          
    }
}

const mr3000 = new MessageReader(3000, "exchange", "amqp://user:bitnami@localhost", "fromAtoB", "fromBtoA");
const mr8080 = new MessageReader(8080, "exchange", "amqp://user:bitnami@localhost", "fromBtoA", "fromAtoB");

mr3000.run();
mr8080.run();