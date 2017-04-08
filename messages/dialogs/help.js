//Dialog for explaining what Yux can do

let yuxfeatures = [
  function (session) {
    session.send("If you give me a picture, I can find clothes that look similar to it or combinations of clothes from Zalora that looks good with it.");
    session.endDialog();
  },
]

module.exports.yuxfeatures = yuxfeatures;
