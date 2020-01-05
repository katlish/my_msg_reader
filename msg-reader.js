"use strict";
exports.__esModule = true;
var express = require('express');
var app = express();
var sender_1 = require("./sender");
var receiver_1 = require("./receiver");
var MessageReader = /** @class */ (function () {
    function MessageReader(port, qtosend, qtoreceive) {
        var _this = this;
        this.sendToSocket = function (msgFromRabbit) {
            console.log("in sendToSocket message is " + msgFromRabbit);
            _this.io.emit('chat message', msgFromRabbit);
            console.log("Msg sent to io");
        };
        this.run = function () {
            var sender = new sender_1.Sender(_this.qtosend);
            var receiver = new receiver_1.Receiver(_this.qtoreceive);
            _this.io.on('connection', function (socket) {
                console.log('a user connected');
                socket.on('disconnect', function () {
                    console.log('user disconnected');
                });
                receiver.consume(_this.sendToSocket);
                socket.on('chat message', function (msg) {
                    _this.io.emit('chat message', msg);
                    sender.send(msg);
                });
            });
            _this.server.listen(_this.port, function () {
                console.log("Server is listening on " + _this.port);
            });
        };
        this.port = port;
        this.qtosend = qtosend;
        this.qtoreceive = qtoreceive;
        var http = require('http').createServer(app);
        this.server = http;
        var io = require('socket.io')(http);
        this.io = io;
        app.get('/', function (req, res) {
            res.sendFile(__dirname + '/index.html');
        });
    }
    return MessageReader;
}());
exports.MessageReader = MessageReader;
var mr3000 = new MessageReader(3000, "fromAtoB", "fromBtoA");
var mr8080 = new MessageReader(8080, "fromBtoA", "fromAtoB");
mr3000.run();
mr8080.run();
