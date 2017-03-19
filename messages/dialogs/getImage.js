var builder = require("botbuilder");
var request = require('request-promise').defaults({ encoding: null });

let getImage = [
  function (session, args) {
    //Saves image url from args to dialogData
    session.dialogData.url = args || {};
    builder.Prompts.choice(session, "What kind of search would you like to perform?",
      ["Find me the best combination","Find me something similar"]);
  },
  function (session, results) {
    if (results.response.index == 0) {
      imgurl = 'abcd';
      session.send("Please wait while I search for the best combination...");
      session.sendTyping();
      const geturl = `http://yuxmobilebackend.azurewebsites.net/api/retrieveOutfitCombos?imgurl=${session.dialogData.url.toString()}`;
      console.log(geturl);
      request(geturl, (error, response, body) => {
        //Check for error
        if(error){
            return console.log('Error:', error);
        }

        //Check for right status code
        if(response.statusCode !== 200){
            return console.log('Invalid Status Code Returned:', response.statusCode);
        }

        //Success
        session.send(body);
        });

    } else if (results.response.index == 1) {
      session.send("Please wait while I search for something similar...");
      //Make POST request with image url for best combination
    }
  }
];

module.exports.getImage = getImage;
