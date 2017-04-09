//Dialog for making GET request to node server APIS with retrieveOutfitCombos and retrieveSimilarClothings
//Present results to user with Hero Cards

var builder = require("botbuilder");
var request = require('request');

//For local testing
const fakeurl = 'https://webchat.botframework.com/attachments/c8ca4c4b904d49e9a36ee4714e090f67/0000001/0/3293.jpg?t=08qroFrsG0s.dAA.YwA4AGMAYQA0AGMANABiADkAMAA0AGQANAA5AGUAOQBhADMANgBlAGUANAA3ADEANABlADAAOQAwAGYANgA3AC0AMAAwADAAMAAwADAAMQA.ftnHjZGg0gE.ZWEciW6R4Vs.oV4e94r7XxC_59uOcqbzjO1MnhX3xIeTf5jebS7mRtc';

let getImage = [
    function(session, args) {
        //Saves image url from args to dialogData
        console.log("Args:" + args);
        session.dialogData.url = args || {};
        builder.Prompts.choice(session, "What kind of search would you like to perform?", ["Best combination", "Something similar"]);
    },
    function(session, results) {
        if (results.response.index == 0) {
            session.send("Please wait while I search for the best combination...");
            session.sendTyping();

            request({
                url: 'http://yuxmobilebackend.azurewebsites.net/api/retrieveOutfitCombos',
                method: 'POST',
                json: {
                    'image_url': session.dialogData.url.toString()
                }
            }, function(err, response, body) {
                if (!err && response.statusCode == 200) {
                    console.log(body);
                    var style = body.outfit.style;

                    session.send("The " + style + " style matches really with your choice of clothing!");

                    var cardArray1 = new Array();
                    var cardArray2 = new Array();
                    var cardArray3 = new Array();

                    if (body.matches.tops.hasOwnProperty('results')) {
                        for (var i = 0; i < body.matches.tops.results.length; i++) {
                            var result = body.matches.tops.results[i];
                            console.log("Top: " + result.title);
                            var newCard = new builder.HeroCard(session)
                                .title(result.title)
                                .subtitle('Listed Price: $' + result.price)
                                .images([
                                    builder.CardImage.create(session, result.image)
                                ])
                                .buttons([
                                    builder.CardAction.openUrl(session, result.url, 'Buy Now')
                                ])

                            if (i == 0) {
                                cardArray1.push(newCard);
                            } else if (i == 1) {
                                cardArray2.push(newCard);
                            } else if (i == 2) {
                                cardArray3.push(newCard);
                            }
                        }
                    } else {
                        console.log("No results in top");
                    }


                    if (body.matches.bottoms.hasOwnProperty('results')) {
                        for (var j = 0; j < body.matches.bottoms.results.length; j++) {
                            var result = body.matches.bottoms.results[j];
                            console.log("Bottoms: " + result.title);
                            var newCard = new builder.HeroCard(session)
                                .title(result.title)
                                .subtitle('Listed Price: $' + result.price)
                                .images([
                                    builder.CardImage.create(session, result.image)
                                ])
                                .buttons([
                                    builder.CardAction.openUrl(session, result.url, 'Buy Now')
                                ])

                            if (j == 0) {
                                cardArray1.push(newCard);
                            } else if (j == 1) {
                                cardArray2.push(newCard);
                            } else if (j == 2) {
                                cardArray3.push(newCard);
                            }
                        }
                    } else {
                        console.log("No results in bot");
                    }

                    if (body.matches.shoes.hasOwnProperty('results')) {
                        for (var k = 0; k < body.matches.shoes.results.length; k++) {
                            var result = body.matches.shoes.results[k];
                            console.log("Shoes: " + result.title);
                            console.log("Url: " + result.image);
                            var newCard = new builder.HeroCard(session)
                                .title(result.title)
                                .subtitle('Listed Price: $' + result.price)
                                .images([
                                    builder.CardImage.create(session, result.image)
                                ])
                                .buttons([
                                    builder.CardAction.openUrl(session, result.url, 'Buy Now')
                                ])

                            if (k == 0) {
                                cardArray1.push(newCard);
                            } else if (k == 1) {
                                cardArray2.push(newCard);
                            } else if (k == 2) {
                                cardArray3.push(newCard);
                            }
                        }
                    } else {
                        console.log("No results in shoes");
                    }

                    if (cardArray1.length > 0) {
                        var reply1 = new builder.Message(session)
                            .attachmentLayout(builder.AttachmentLayout.carousel)
                            .attachments(cardArray1);
                        session.send(reply1);
                    }

                    if (cardArray2.length > 0) {
                        var reply2 = new builder.Message(session)
                            .attachmentLayout(builder.AttachmentLayout.carousel)
                            .attachments(cardArray2);
                        session.send(reply2);
                    }

                    if (cardArray3.length > 0) {
                        var reply3 = new builder.Message(session)
                            .attachmentLayout(builder.AttachmentLayout.carousel)
                            .attachments(cardArray3);
                        session.send(reply3);
                    }

                    session.endDialog("Hope you like the combinations!");

                } else {
                    console.log(err);
                    console.log("Status: " + response.statusCode);
                    session.endDialog("Sorry, there was an error. Please try again.");
                }
            });

        } else if (results.response.index == 1) {
            session.send("Please wait while I search for something similar...");
            session.sendTyping();
            console.log(session.dialogData);
            console.log("Img Url: " + session.dialogData.url.toString());
            request({
                url: 'http://yuxmobilebackend.azurewebsites.net/api/retrieveSimilarClothings',
                method: 'POST',
                json: {
                    'image_url': session.dialogData.url.toString()
                }
            }, function(err, response, body) {
                if (!err && response.statusCode == 200) {
                    console.log(body.results[0].title)
                    var cardArray = new Array();
                    for (var i = 0; i < body.results.length; i++) {

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
                    session.endDialog(reply)
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
