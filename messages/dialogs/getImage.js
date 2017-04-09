//Dialog for making GET request to node server APIS with retrieveOutfitCombos and retrieveSimilarClothings
//Present results to user with Hero Cards

var builder = require("botbuilder");
var request = require('request');

//For local testing
const fakeurl = 'https://webchat.botframework.com/attachments/c8ca4c4b904d49e9a36ee4714e090f67/0000001/0/3293.jpg?t=08qroFrsG0s.dAA.YwA4AGMAYQA0AGMANABiADkAMAA0AGQANAA5AGUAOQBhADMANgBlAGUANAA3ADEANABlADAAOQAwAGYANgA3AC0AMAAwADAAMAAwADAAMQA.ftnHjZGg0gE.ZWEciW6R4Vs.oV4e94r7XxC_59uOcqbzjO1MnhX3xIeTf5jebS7mRtc';

let getImage = [
    function(session, args) {
        //Saves image url from args to dialogData
        session.dialogData.url = args || {};
        builder.Prompts.choice(session, "What kind of search would you like to perform?", ["Best combination", "Something similar"]);
    },
    function(session, results) {
        if (results.response.index == 0) {
            session.send("Please wait while I search for the best combination...");
            session.sendTyping();



        } else if (results.response.index == 1) {
            session.send("Please wait while I search for something similar...");
            session.sendTyping();
            console.log("Img Url: " + session.dialogData.url.toString());
            request({
              url: 'http://yuxmobilebackend.azurewebsites.net/api/retrieveSimilarClothings',
              method: 'POST',
              json: {'image_url': session.dialogData.url.toString()}
            }, function(err, response, body) {
              if (!err && response.statusCode == 200) {
                console.log(body.results[0].title)
                var cardArray = new Array();
                for (var i=0; i<body.results.length; i++) {

                  var newCard = new builder.HeroCard(session)
                  .title(body.results[i].title)
                  .subtitle('Listed Price: $' + body.results[i].price)
                  .images([
                      builder.CardImage.create(session, body.results[i].image)
                  ])
                  .buttons([
                      builder.CardAction.openUrl(session, body.results[i].url, 'Buy Now')
                  ])

                  cardArray.push(newCard);
                }

                var reply = new builder.Message(session)
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(cardArray);
                session.send(reply)
              } else {
                console.log(err);
                console.log("Status: " + response.statusCode);
                session.endDialog("Sorry, there was an error. Please try again.");
              }
            });
        }
    }
];

module.exports.getImage = getImage;
