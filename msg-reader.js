"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
//FIXME: use import instead of require
var express = require('express');
var app = express();
var io = require('socket.io');
var rabbitmq_reader_1 = require("./rabbitmq-reader");
var MessageReader = /** @class */ (function () {
    function MessageReader(port, exchange, credentialsOfRabbit, routingKey, bindingKey) {
        var _this = this;
        this.sendToSocket = function (msgFromRabbit) {
            console.log("in sendToSocket message is " + msgFromRabbit);
            _this.socketIO.emit('chat message', msgFromRabbit);
            console.log("Msg sent to io");
        };
        this.port = port;
        this.exchange = exchange;
        this.credentialsOfRabbit = credentialsOfRabbit;
        this.routingKey = routingKey;
        this.bindingKey = bindingKey;
        //TODO: why can't write this request outside the constructor?
        this.server = require('http').createServer(app);
        this.socketIO = io(this.server);
        //TODO: how to extract the routs from this class?
        app.get('/', function (req, res) {
            res.sendFile(__dirname + '/index.html');
        });
    }
    MessageReader.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rabbitReader;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.server.listen(this.port, function () {
                            console.log("Server is listening on " + _this.port);
                        });
                        rabbitReader = new rabbitmq_reader_1.RabbitMQReader(this.exchange, this.credentialsOfRabbit);
                        return [4 /*yield*/, rabbitReader.runRabbitAndAssertExchange()];
                    case 1:
                        _a.sent();
                        this.socketIO.on('connection', function (socket) {
                            console.log('a user connected');
                            socket.on('disconnect', function () {
                                console.log('user disconnected');
                            });
                            rabbitReader.consumeFromRabbit(_this.bindingKey, _this.sendToSocket);
                            socket.on('chat message', function (msg) {
                                _this.socketIO.emit('chat message', msg);
                                rabbitReader.sendToRabbit(msg, _this.routingKey);
                            });
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    return MessageReader;
}());
exports.MessageReader = MessageReader;
var mr3000 = new MessageReader(3000, "exchange", "amqp://user:bitnami@localhost", "fromAtoB", "fromBtoA");
var mr8080 = new MessageReader(8080, "exchange", "amqp://user:bitnami@localhost", "fromBtoA", "fromAtoB");
mr3000.run();
mr8080.run();
