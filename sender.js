#!/usr/bin/env node
"use strict";
exports.__esModule = true;
var amqp = require('amqplib/callback_api');
var Sender = /** @class */ (function () {
    function Sender(q) {
        var _this = this;
        this.send = function (msg) {
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
                    channel.sendToQueue(_this.q, Buffer.from(msg));
                    console.log("msg " + msg + " sent to rabbitMQ");
                });
                setTimeout(function () {
                    console.log("in sender: before close");
                    connection.close();
                    console.log("in sender: after close");
                }, 500);
            });
        };
        this.q = q;
    }
    return Sender;
}());
exports.Sender = Sender;
