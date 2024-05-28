import config from 'config'
import TelegramBot from 'node-telegram-bot-api'

console.log(config.get("TEST_ENV"));

const token = config.get("TELEGRAM_TOKEN");

const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/echo (.+)/, (msg, match) => {

    const chatId = msg.chat.id;
    const resp = match[1];

    bot.sendMessage(chatId, resp);
});


bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    try {
        bot.sendMessage(chatId, JSON.stringify(msg,null,2));
        if(msg.voice){
            bot.sendVoice(chatId,msg.voice.file_id);
        }
    }catch (e) {
        console.log(e.message)
    }

});