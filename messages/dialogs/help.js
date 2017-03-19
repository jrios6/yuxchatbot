//Dialog for explaining what Yux can do

let yuxfeatures = [
  function (session) {
      session.send("If you give me a picture, I can find clothes that look similar to it or combinations of clothes from Zalora that looks good with it.");
      //session.send("I can also tell you if a piece of clothing or pair of shoes is a good buy! :)");
      //session.send("I can also give you basic fashion advice or tell you more about recent trends in fashion.");
      session.endDialog();
  },
]

module.exports.yuxfeatures = yuxfeatures;
