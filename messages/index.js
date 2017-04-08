"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var request = require('request');

//Dialog Modules
var help = require("./dialogs/help.js");
var profiling = require("./dialogs/profiling.js");
var deleteProfile = require("./dialogs/deleteProfile.js");
var getImage = require("./dialogs/getImage.js");

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


//Default handles case where user uploads image directly
dialog.onDefault(function (session, args, next) {
  var msg = session.message;
  if (msg.attachments.length) {
    // Message with attachment, proceed to perform query
    var attachment = msg.attachments[0];
    session.beginDialog('/imagequery', attachment.contentUrl);
  } else {
    session.send("Say Hi to get started!");
  }
})

//Dialogs
dialog.matches('greetings', [
 (session) => {
   session.beginDialog('/yuxfeatures');
    //   if (session.userData.choice1) {
    //     //User has already been profiled
    //     session.beginDialog('/yuxfeatures');
    //   } else {
    //     //Starts profiling user
    //     session.beginDialog('/profiling');
    //   }
    // }
]);

//Dialog for handling image queries
bot.dialog('/imagequery', getImage.getImage);

//Dialog for deleting user's profile
//dialog.matches(/^delete profile/i, deleteProfile.confirm);

//Dialog for profiling of user
//bot.dialog('/profiling', profiling.questions);

//Dialog that describes the features of Yux
bot.dialog('/yuxfeatures', help.yuxfeatures);



if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpoint at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());
} else {
    module.exports = { default: connector.listen() }
}
