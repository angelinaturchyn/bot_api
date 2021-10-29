
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const server = express();
const path = require('path');
const token = '1953278747:AAHgr9UX-SbRLKZakVB9MVimtTidsd2QzBQ';
const options = {polling: true};
const bot = new TelegramBot(token, {polling: true});
const port =process.env.PORT || 5000;
const gameName = 'OptionGame';
const queries = {};

///const url = new URL(location.href);
///const playerid = url.searchParams.get("id");

server.use(express.static(path.join(__dirname, 'public' )));  //


bot.onText(/start|game/, (msg) => bot.sendGame(msg.from.id, gameName));
bot.onText(/help/, (msg) => bot.sendMessage(msg.from.id, "This bot implements an Option Game. Say /game if you want to play."));

bot.on("callback_query", function (query) {
    if (query.game_short_name !== gameName) {
        bot.answerCallbackQuery(query.id, "Sorry, '" + query.game_short_name + "' is not available.");
    } else {
        queries[query.id] = query;
        let gameUrl = "https://angelinaturchyn.github.io/telegram-front/"
            //"https://git.heroku.com/stormy-retreat-28413.git"
        bot.answerCallbackQuery({
            callback_query_id: query.id,
            url: gameUrl
        });
    }
});
bot.on("inline_query", function(iq) {
    bot.answerInlineQuery(iq.id, [ { type: "game", id: "0", game_short_name: gameName } ] );
});


bot.on("inline_query", function (iq) {
    bot.answerInlineQuery(iq.id, [{
        type: "game",
        id: "0",
        game_short_name: gameName
    }]);
});

// server.get("/highscore/:score", function(req, res, next) {
//     if (!Object.hasOwnProperty.call(queries, req.query.id)) return   next();
//     let query = queries[req.query.id];
//     let options;
//     if (query.message) {
//         options = {
//             chat_id: query.message.chat.id,
//             message_id: query.message.message_id
//         };
//     } else {
//         options = {
//             inline_message_id: query.inline_message_id
//         };
//     }

//     bot.setGameScore(query.from.id, parseInt(req.params.score),  options,
//         function (err, result) {});
// });




bot.onText(/\/start/, function  onOptions(msg) {


    const opts = {
            reply_markup: {
                inline_keyboard: [

                    [{text: 'Listen to some music', callback_data: 'btn_2'}],
                    [{text: 'Watch some dog memes', callback_data: 'btn_3'}],
                ]
            }
        };

        bot.sendMessage(msg.from.id, 'What are you in the mood for today?', opts);

});


// Handle callback queries
bot.on('callback_query',async function  onCallbackQuery(callbackQuery) {
    const action = callbackQuery.data;
    const  msg = callbackQuery.message;
    const opts   = {
        chat_id: msg.chat.id,
        message_id: msg.message_id,
    };
    let text;

    // if (action === 'btn_1') {
    //     text = 'Start Option Game'
    // }

    if (action === 'btn_2') {
       text = 'Open YOUToube'
    }

    if (action === 'btn_3') {
       text = 'Watch dog memes';
    }

    bot.editMessageText(text, opts);
});



bot.on('message', (msg) => {

    let Hi = "hi";
    if (msg.text.toString().toLowerCase().indexOf(Hi) === 0) {
        bot.sendMessage(msg.chat.id,"Hi there! Welcome "+ msg.from.first_name);
    }
    let bye = "bye";
    if (msg.text.toString().toLowerCase().includes(bye)) {
        bot.sendMessage(msg.chat.id, "Hope to see you around again , Bye");
    }
});



bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    bot.sendMessage(chatId, resp);
});


bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(chatId,  msg.from.first_name +' your message has been received by a bot')
});

bot.onText(/\/love/, function onLoveText(msg) {
    const opts = {
        reply_to_message_id: msg.message_id,
        reply_markup: JSON.stringify({
            keyboard: [
                ['Yes, you are the bot of my life ❤'],
                ['No, sorry there is another one...']
            ]
        })
    };
    bot.sendMessage(msg.chat.id, 'Do you love me?', opts);
});



// // Submit highscore to Telegram
// var xmlhttp = new XMLHttpRequest();
// var url = "https://telegram.me/option_gameBot?game=OptionGame/highscore/" + distance  +
//     "?id=" + playerid;
// xmlhttp.open("GET", url, true);
// xmlhttp.send();


server.listen(port);
