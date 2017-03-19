//Dialog for making GET request to node server APIS with retrieveOutfitCombos and retrieveSimilarClothings
//Present results to user with Hero Cards

var builder = require("botbuilder");
var request = require('request');

//For local testing
const fakeurl = 'https://webchat.botframework.com/attachments/c8ca4c4b904d49e9a36ee4714e090f67/0000001/0/3293.jpg?t=08qroFrsG0s.dAA.YwA4AGMAYQA0AGMANABiADkAMAA0AGQANAA5AGUAOQBhADMANgBlAGUANAA3ADEANABlADAAOQAwAGYANgA3AC0AMAAwADAAMAAwADAAMQA.ftnHjZGg0gE.ZWEciW6R4Vs.oV4e94r7XxC_59uOcqbzjO1MnhX3xIeTf5jebS7mRtc';

let getImage = [
  function (session, args) {
    //Saves image url from args to dialogData
    session.dialogData.url = args || {};
    builder.Prompts.choice(session, "What kind of search would you like to perform?",
      ["Find me the best combination","Find me something similar"]);
  },
  function (session, results) {
    if (results.response.index == 0) {
      session.send("Please wait while I search for the best combination...");
      session.sendTyping();
      const geturl = `http://yuxmobilebackend.azurewebsites.net/api/retrieveOutfitCombos?imgurl=${session.dialogData.url.toString()}`;
      request(geturl,function (error, response, body) {
          if (!error && response.statusCode == 200) {
            //TODO: Parse JSON Response and return user result in Hero Cards/ Carousel
            session.endDialog(body);
          } else {
            session.endDialog("Sorry, there was an error. Please try again.")
          }
      });
    } else if (results.response.index == 1) {
      session.send("Please wait while I search for something similar...");
      session.sendTyping();
      const geturl = `http://yuxmobilebackend.azurewebsites.net/api/retrieveSimilarClothings?imgurl=${session.dialogData.url.toString()}`;
      request(geturl,function (error, response, body) {
          if (!error && response.statusCode == 200) {
            //TODO: Parse JSON Response and return user result in Hero Cards/ Carousel
            session.endDialog(body);
          } else {
            session.endDialog("Sorry, there was an error. Please try again.")
          }
      });
    }
  }
];

module.exports.getImage = getImage;
