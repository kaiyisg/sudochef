'use strict';
var Alexa = require("alexa-sdk");
var http = require('http');
var alexa;

exports.handler = function(event, context, callback) {
    alexa = Alexa.handler(event, context);
    // alexa.appId = "amzn1.ask.skill.28a94dde-ebeb-4ecf-8b3a-98289271b1c3";
    alexa.registerHandlers(handlers, startModeHandlers, idleModeHandlers);
    alexa.execute();
};

var states = {
    IDLEMODE: '_IDLEMODE', 
    STARTMODE: '_STARTMODE'
};

var location = "Seattle";
var APIKey = "4844d21f760b47359945751b9f875877";

var handlers = {
    // shortcuts all requests here
    'NewSession': function() {
        if (new String(this.handler.state).valueOf() == new String(states.STARTMODE).valueOf()) {
            this.handler.state = states.STARTMODE;
            this.emit('Continue');
        } else {
            this.handler.state = '';
            if(Object.keys(this.attributes).length === 0) {
                this.attributes['sessionInstructionIndex'] = 0;
            }
            httpGet(location, function (response) {
                var responseData = JSON.parse(response);
                var output = "";
                if (responseData == null) {
                    output = "There was a problem with getting data please try again";
                }
                else {
                    if (responseData.response.docs.length==0) {
                        output = "There is no data!";
                    } else {
                        var headline = responseData.response.docs[0].headline.main;
                        output += " Headline " + ": " + headline + ";";
                    }
                }
                alexa.emit(':tell', output);
            });
            // this.emit(':ask', 'Welcome to sudochef! Say yes to start your cooking session or no to quit',
            //     'Say yes to start your cooking session or no to quit');
        }
    },
    'GetRecipes': function() {
        this.handler.state = '';
        //TODO: API call
        this.emit(':ask', 'Your recipes are. Say yes to start your cooking session or no to quit' ,
            'Say yes to start your cooking session or no to quit');
    },
    'YesIntent': function() {
        this.handler.state = states.STARTMODE;
        this.emit(':ask', 'Great! ' + 'Just call out for the next step of your recipe when you are ready!');
    },
    'NoIntent': function() {
        console.log("NOINTENT");
        this.handler.state = states.IDLEMODE;
        this.emit(':tell', 'Ok, hope to cook with you next time!');
    },
    "AMAZON.StopIntent": function() {
        this.handler.state = states.IDLEMODE;
        this.emit(':tell', "Goodbye!");  
    },
    "AMAZON.CancelIntent": function() {
        this.handler.state = states.IDLEMODE;
        this.emit(':tell', "Goodbye!");  
    },
    'SessionEndedRequest': function () {
        this.handler.state = states.IDLEMODE;
        this.emit(":tell", "Goodbye!");
        this.emit(':saveState', true);
    },
};

var startModeHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
    'Continue': function () {
        this.emit(':tell', 'You left off here. Call for the next step to continue');
    },
    'StartNextStepIntent': function () {
        this.handler.state = states.STARTMODE;
        this.emit(':tell', 'Start next step!');
    },
    'RepeatPreviousStepIntent': function () {
        this.handler.state = states.STARTMODE;
        this.emit(':tell', 'Repeat previous step!');
    },
    'EndRecipeIntent': function () {
        this.handler.state = states.IDLEMODE;
        this.emit(':tell', 'Sudo Chef has ended. Thanks for using Sudo chef!');
    }
});

var idleModeHandlers = Alexa.CreateStateHandler(states.IDLEMODE, {
    'StartRecipeIntent': function () {
        this.handler.state = '';
        this.emitWithState('NewSession');
    },
    'GetRecipeIntent': function () {
        this.handler.state = '';
        this.emitWithState('GetRecipes');
    },
});

function httpGet(query, callback) {
  console.log("/n QUERY: "+query);

    var options = {
      //http://api.nytimes.com/svc/search/v2/articlesearch.json?q=seattle&sort=newest&api-key=
        host: 'api.nytimes.com',
        path: '/svc/search/v2/articlesearch.json?q=' + query + '&sort=newest&api-key=' + APIKey,
        method: 'GET'
    };

    var req = http.request(options, (res) => {

        var body = '';

        res.on('data', (d) => {
            body += d;
        });

        res.on('end', function () {
            callback(body);
        });

    });
    req.end();

    req.on('error', (e) => {
        console.error(e);
    });
}


        // axios.get('https://api.sandbox.amadeus.com/v1.2/hotels/LMDCA164?apikey=M6qdLchnPCgS7llAcQJycSk3GA1AlUxD&check_in=2017-3-4&check_out=2017-3-6')
        // .then(function(value) {
        //     console.log(value.property_code);
        // }, function(reason) {
        //     console.log(reason);
        // });
