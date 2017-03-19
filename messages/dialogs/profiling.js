/* Dialog for profiling user's preferences using five questions
 * User's input is saved under session.userData
 */

var builder = require("botbuilder");

let questions = [
    function (session) {
      //Prompts user with choice of either starting the profiling or skipping
      builder.Prompts.choice(session, "Hi there! I’m Yux, your personal fashion search engine! To give you more personalised results, I will be asking you five simple questions.",
          ["Start","Skip"]);
    },
    function (session, results) {
      if (results.response.entity == 'Start') {
          builder.Prompts.choice(session, "Q1. Do you shop for clothes in stores or online more?",
            ["In Stores", "Online"]);
      } else {
        //SKIPS cancel the dialog and start /yuxfeatures directly
        session.cancelDialog(0, '/yuxfeatures');
      }
    },
    function (session, results) {
      session.userData.choice1 = results.response.entity;
      builder.Prompts.choice(session, "Q2. How much do you spend on clothes on average each month?",
        ["Less Than $250", "$250 to $1000", "More Than $1000"]);
    },
    function (session, results) {
      console.log("C2:", results.response.entity)
      session.userData.choice2 = results.response.entity;
      builder.Prompts.text(session, "Q3. What’s your occupation?");
    },
    function (session, results) {
      session.userData.choice3 = results.response;
      builder.Prompts.number(session, "Q4. What’s your age?");
    },
    function (session, results) {
      console.log("C4:", results.response)
      session.userData.choice4 = results.response;
      builder.Prompts.text(session, "Q5. What’s your fashion idol?");
    },
    function (session, results) {
      session.userData.choice5 = results.response;
      session.send("Thanks for completing the profiling! Here's what I can do:");
      session.beginDialog('/yuxfeatures');
    },
]

module.exports.questions = questions;
