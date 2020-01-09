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
var Amqp = require("amqplib");
//FIXME: store all the vars in members, call to functions in the constructor 
//TODO: how to catch errors in constructor?
//TODO: create a function to establish all the infrastructure that will be called in the constructor
//FIXME: types of the connection, channel
var Sender = /** @class */ (function () {
    function Sender(exchange, credentials) {
        var _this = this;
        this.assertEx = function () {
            // this.channel.assertQueue(this.q, {
            //     durable: false
            // });
            // console.log("q asserted.")
            _this.channel.assertExchange(_this.exchange, 'direct', {
                durable: false
            });
            console.log("exchange asserted.");
        };
        this.send = function (msg, routingKey) {
            _this.channel.publish(_this.exchange, routingKey, Buffer.from(msg));
            console.log(" [x] Msg sent by routing key %s is: '%s'", routingKey, msg);
            // this.channel.sendToQueue(this.q, Buffer.from(msg));
            // console.log(`msg ${msg} sent to rabbitMQ`)
        };
        this.exchange = exchange;
        this.credentials = credentials;
        this.isConnected = false;
    }
    Sender.prototype.connectionToRabbit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var connection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Amqp.connect(this.credentials)];
                    case 1:
                        connection = _a.sent();
                        console.log("connection created: " + connection);
                        return [2 /*return*/, connection];
                }
            });
        });
    };
    Sender.prototype.createChannel = function () {
        return __awaiter(this, void 0, void 0, function () {
            var channel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.createChannel()];
                    case 1:
                        channel = _a.sent();
                        console.log("channel created.");
                        return [2 /*return*/, channel];
                }
            });
        });
    };
    Sender.prototype.runRabbitAndAssertExchange = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.connectionToRabbit()];
                    case 1:
                        _a.connection = _c.sent();
                        _b = this;
                        return [4 /*yield*/, this.createChannel()];
                    case 2:
                        _b.channel = _c.sent();
                        if (this.connection && this.channel) {
                            this.isConnected = true;
                            this.assertEx();
                            console.log("rabbit connected and exchange is asserted.");
                        }
                        else {
                            console.log("Connection failed => status of connections: connection = " + this.connection + ", channel = " + this.channel);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return Sender;
}());
exports.Sender = Sender;
function runSender() {
    return __awaiter(this, void 0, void 0, function () {
        var sender;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sender = new Sender("exchange", "amqp://user:bitnami@localhost");
                    return [4 /*yield*/, sender.runRabbitAndAssertExchange()];
                case 1:
                    _a.sent();
                    sender.send("bla", "fromAtoB");
                    return [2 /*return*/];
            }
        });
    });
}
runSender();
