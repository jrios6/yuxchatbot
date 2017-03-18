"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var request = require('request');


var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);

const LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/b2fb8232-992d-4838-8caf-b6d05bfe08cc?subscription-key=7540fc2268fa47f7a57ea60184c2d7fb&verbose=true&q=';
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', dialog);

//Dialogs
dialog.matches('greetings', [
    function (session, args, next) {
        if (session.userData.name) {
            session.beginDialog('/profiling');
        } else {
            session.beginDialog('/getimage');
        }
    }
]);

bot.dialog('/getimage', [
  function (session, results) {
    builder.Prompts.attachment(session, "Upload a picture for me to search.");
  },
  function (session, results) {
    if (results.response) {
      console.log("Image Uploaded")
      session.send(results.response[0].contentUrl);
      builder.Prompts.choice(session, "What kind of search would you like to perform?",
        ["Find me the best combination","Find me something similar"]);
    } else {
      session.beginDialog('/getimage');
    }
  },
  function (session, results) {
    if (results.response.index == 0) {
      session.send("Please wait while I search for the best combination...");
      request.post(
          'http://yuxmobilebackend.azurewebsites.net/api/date',
          { json: { key: 'value' } },
          function (error, response, body) {
              if (!error && response.statusCode == 200) {
                  console.log(body);
                  session.send(body.currentTime);
              }
          }
      );
    } else if (results.response.index == 1) {
      session.send("Please wait while I search for something similar...");
      //Make POST request with image url for best combination
    }
  }
]);

//Dialog for profiling of user
bot.dialog('/profiling', [
    function (session) {
        builder.Prompts.choice(session, "Hi there! I’m Yux, your personal fashion search engine! To give you more personalised results, I will be asking you five simple questions.",
          ["Start","Skip"]);
    },
    function (session, results) {
      if (results.response.entity == 'Start') {
          builder.Prompts.choice(session, "Q1. Do you shop for clothes in stores or online more?",
            ["In Stores", "Online"]);
      } else {
        //Skip
      }
    },
    function (session, results) {
      //Save results.response.entity
      builder.Prompts.choice(session, "Q2. How much do you spend on clothes on average each month?",
        ["Less Than $250", "$250 to $1000", "More Than $1000"]);
    },
    function (session, results) {
      //Save results.response.entity
      builder.Prompts.text(session, "Q3. What’s your occupation?");
    },
    function (session, results) {
      //Save results.response.entity
      builder.Prompts.text(session, "Q4. What’s your age?");
    },
    function (session, results) {
      //Save results.response.entity
      builder.Prompts.text(session, "Q5. What’s your fashion idol?");
    },
    function (session, results) {
      //Save results.response.entity
      session.send("Thanks for completing the profiling! Here's what I can do:");
      session.beginDialog('/yuxfeatures');
    },
]);

//Dialog that describes the features of Yux
bot.dialog('/yuxfeatures', [
  function (session) {
      session.send("If you give me a picture, I can find clothes that look similar to it or combinations of clothes from Zalora that looks good with it.");
      //session.send("I can also tell you if a piece of clothing or pair of shoes is a good buy! :)");
      //session.send("I can also give you basic fashion advice or tell you more about recent trends in fashion.");
      session.endDialog();
  },
])

if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());
} else {
    module.exports = { default: connector.listen() }
}
