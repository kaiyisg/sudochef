'use strict';
var Alexa = require("alexa-sdk");
var http = require('http');
var fs = require('fs');
// var state = require('./store.json');
// var filename = './store.json';
var alexa;

const data = 
[
"Make a pot of strong coffee",
"pour into a dish or bowl and allow to cool.",
"RINSE chicken pieces and pat dry.",
"Place pieces in large mixing bowl.",
"In a small bowl, combine the mayonnaise, lemon juice, Worcestershire sauce, garlic powder, and the black pepper.",
"Pour mixture over chicken pieces and toss to thoroughly coat chicken.",
"Put the bread crumbs in a large plastic bag.",
"Put one piece of the chicken at a time into the bag and shake to coat chicken.",
"Put the chicken into a glass baking dish or broiler pan.",
"BAKE at 425 degrees for 40 minutes or until golden brown and tender.",
"Add the brandy.",
"Separate the eggs and set aside whites.",
"In a large bowl, beat the egg yolks and the sugar together until pale and thick.",
"Add the mascarpone and mix until combined.",
"In another bowl, whip the cream.",
"Fold into the egg, sugar and cheese mixture.",
"In a third bowl, beat the egg whites into soft peaks and then quickly fold into the cream mix.",
"Sprinkle a thin layer of cocoa powder into a large dish.",
"Dip the biscuits into the coffee and brandy mixture, taking care not to soak them for too long, before placing in the dish.",
"Continue dipping biscuits and placing in the dish (or place in dish and sprinkle), creating a layer of soaked biscuits.",
"Dust with a sprinkling of cocoa powder.",
"Spread a thick layer of the cream mixture over the layer of biscuits, dust with another sprinkling of cocoa powder.",
"Place another layer of soaked biscuits in the dish, again sprinkling with cocoa powder.",
"Smooth the rest of the cream mixture in a thick layer over the second biscuit layer.",
"Sprinkle with cocoa powder.",
"Place in refrigerator and allow to set, do not serve for at least 2 hours and for the best flavor, leave for 24 hours."
];

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
        //if (new String(this.handler.state).valueOf() == new String(states.STARTMODE).valueOf()) {
        this.handler.state = '';
        if(Object.keys(this.attributes).length === 0) {
            this.attributes['sessionInstructionIndex'] = 0;
        }
        // console.log(state);
        this.emit(':ask', `Welcome to sudochef! Say yes to start your cooking session or no to quit`,
            'Say yes to start your cooking session or no to quit');
        // if (state.data == 1) {
        //     this.handler.state = states.STARTMODE;
        //     this.emit('Continue');
        // } else {
        //     // state.data = 1;
        //     // fs.writeFile(filename, JSON.stringify(state), function (err) {
        //     //   if (err) return console.log(err);
        //     //   console.log(JSON.stringify(state));
        //     //   console.log('writing to ' + filename);
        //     // });
        //     this.handler.state = '';
        //     if(Object.keys(this.attributes).length === 0) {
        //         this.attributes['sessionInstructionIndex'] = 0;
        //     }
        //     // console.log(state);
        //     this.emit(':ask', `Welcome to sudochef! Say yes to start your cooking session or no to quit`,
        //         'Say yes to start your cooking session or no to quit');
        // }
    },
    'GetRecipes': function() {
        this.handler.state = '';
        this.emit(`:ask', 'Your recipes are Baked Chicken and Tiramisu. Say yes to start your cooking session or no to quit' ,
            'Say yes to start your cooking session or no to quit`);
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
        if (this.attributes['sessionInstructionIndex'] == 0) {
            this.emit(':tell', 'Call for the next step to continue');
        } else {
            var index = this.attributes['sessionInstructionIndex'];
            this.emit(':tell', `You left off at ${data[index]}. Call for the next step to continue`);
        }
    },
    'StartNextStepIntent': function () {
        var index = this.attributes['sessionInstructionIndex'];
        if (this.attributes['sessionInstructionIndex'] < data.length) {
            this.handler.state = states.STARTMODE;
            this.emit(':tell', `The next step is ${data[index]}`);
            this.attributes['sessionInstructionIndex']++;
        } else {
            this.handler.state = states.IDLEMODE;
            this.emit(':tell', 'There are no more steps!');
            this.attributes['sessionInstructionIndex'] = 0;
        }
    },
    'RepeatPreviousStepIntent': function () {
        this.handler.state = states.STARTMODE;
        this.emit(':tell', `The next step is ${data[index]}`);
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

// function httpGet(query, callback) {
//   console.log("/n QUERY: "+query);

//     var options = {
//       //http://api.nytimes.com/svc/search/v2/articlesearch.json?q=seattle&sort=newest&api-key=
//         host: 'api.nytimes.com',
//         path: '/svc/search/v2/articlesearch.json?q=' + query + '&sort=newest&api-key=' + APIKey,
//         method: 'GET'
//     };

//     var req = http.request(options, (res) => {

//         var body = '';

//         res.on('data', (d) => {
//             body += d;
//         });

//         res.on('end', function () {
//             callback(body);
//         });

//     });
//     req.end();

//     req.on('error', (e) => {
//         console.error(e);
//     });
// }

        // axios.get('https://api.sandbox.amadeus.com/v1.2/hotels/LMDCA164?apikey=M6qdLchnPCgS7llAcQJycSk3GA1AlUxD&check_in=2017-3-4&check_out=2017-3-6')
        // .then(function(value) {
        //     console.log(value.property_code);
        // }, function(reason) {
        //     console.log(reason);
        // });
        // httpGet(location, function (response) {
        //         var responseData = JSON.parse(response);
        //         var output = "";
        //         if (responseData == null) {
        //             output = "There was a problem with getting data please try again";
        //         }
        //         else {
        //             if (responseData.response.docs.length==0) {
        //                 output = "There is no data!";
        //             } else {
        //                 var headline = responseData.response.docs[0].headline.main;
        //                 output += " Headline " + ": " + headline + ";";
        //             }
        //         }
        //         alexa.emit(':tell', output);
        //     });
