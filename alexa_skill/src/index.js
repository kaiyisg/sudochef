'use strict';
var Alexa = require("alexa-sdk");

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit(':tell', 'Launching!');
    },
    'HelloWorldIntent': function () {
        this.emit('SayHello')
    },
    'ByeWorldIntent': function () {
        this.emit('SayBye')
    },
    'SayHello': function () {
        this.emit(':tell', 'Hello World!');
    },
    'SayBye': function () {
        this.emit(':tell', 'Bye World!');
    }
};