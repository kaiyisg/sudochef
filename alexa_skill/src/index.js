'use strict';
var Alexa = require("alexa-sdk");

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit(':tell', 'Sudochef has started!');
    },
    'StartRecipeIntent': function () {
        this.emit(':tell', 'Start recipe!');
    },
    'StartNextStepIntent': function () {
        this.emit(':tell', 'Start next step!');
    },
    'RepeatPreviousStepIntent': function () {
        this.emit(':tell', 'Repeat previous step!');
    }
};