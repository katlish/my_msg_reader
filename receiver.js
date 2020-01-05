#!/usr/bin/env node
"use strict";
exports.__esModule = true;
var amqp = require('amqplib/callback_api');
var Receiver = /** @class */ (function () {
    function Receiver(q) {
        var _this = this;
        this.consume = function (sendToSocket) {
            amqp.connect('amqp://user:bitnami@localhost', function (error0, connection) {
                if (error0) {
                    console.log(error0);
                    throw error0;
                }
                connection.createChannel(function (error1, channel) {
                    if (error1) {
                        throw error1;
                    }
                    channel.assertQueue(_this.q, {
                        durable: false
                    });
                    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", _this.q);
                    channel.consume(_this.q, function (msg) {
                        sendToSocket(msg.content.toString());
                        console.log("sendToSocket is called and finished");
                    }, {
                        noAck: true // when true - receiver doesn't have any problems and is ready to receive. 
                        // when false - receiver has a problem and asks rabbit to store the message in its memory
                    });
                });
            });
        };
        this.q = q;
    }
    return Receiver;
}());
exports.Receiver = Receiver;
