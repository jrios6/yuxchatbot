//Dialog for deleteing user's profile

var builder = require("botbuilder");

let confirm = [
  (session) => {
    //Prompts for deletion confirmation
    builder.Prompts.confirm(session, "Are you sure you wish to delete your profile?");
  },
  (session, results) => {
    if (results.response == true) {
      delete session.userData //Deletes user's data
      session.endDialog('Your profile has been deleted.')
    }
  }
];

module.exports.confirm = confirm;
