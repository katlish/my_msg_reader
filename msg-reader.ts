const express = require('express');
const app = express();

import { Sender } from './sender';
import { Receiver } from './receiver';
import { Server } from 'http';






export class MessageReader {
    port: number;
    qtosend: string;
    qtoreceive: string;
    io: Server;
    server: any;

    constructor(port: number, qtosend: string, qtoreceive: string) { 
        this.port = port; 
        this.qtosend = qtosend;
        this.qtoreceive = qtoreceive; 

        const http = require('http').createServer(app);
        this.server = http;
        const io = require('socket.io')(http);
        this.io = io;

        app.get('/', function(req, res){
        res.sendFile(__dirname + '/index.html');
        });
    }

    private  sendToSocket = (msgFromRabbit: string) : void => {
        console.log(`in sendToSocket message is ${msgFromRabbit}`);
        this.io.emit('chat message', msgFromRabbit);  
        console.log("Msg sent to io");
    }

    public run = () => {
        const sender = new Sender(this.qtosend);
        const receiver = new Receiver(this.qtoreceive);

        this.io.on('connection', (socket) => {
            console.log('a user connected');
            socket.on('disconnect', () => {
              console.log('user disconnected');
            });
          
            
            receiver.consume(this.sendToSocket);
            
            socket.on('chat message', (msg) => {
                this.io.emit('chat message', msg)
                sender.send(msg);
            });
            
          });
          
          
          
          
          this.server.listen(this.port, () => {
            console.log(`Server is listening on ${this.port}`);
          });
    }
}

const mr3000 = new MessageReader(3000, "fromAtoB", "fromBtoA");
const mr8080 = new MessageReader(8080, "fromBtoA", "fromAtoB");

mr3000.run();
mr8080.run();