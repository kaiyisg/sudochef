'use strict';
var Alexa = require("alexa-sdk");

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const states = {
    IDLEMODE: '_IDLEMODE', 
    STARTMODE: '_STARTMODE',
};

var handlers = {
    'LaunchRequest': function () {
        this.emit(':tell', 'Sudochef has started!');
    },
    'GetRecipeIntent': function () {
        this.emit(':tell', 'Get recipe!');
    }
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