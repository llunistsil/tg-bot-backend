import config from 'config'
import TelegramBot from 'node-telegram-bot-api'
import OpenAI from "openai"

console.log(config.get("TEST_ENV"));

const openai = new OpenAI({apiKey:config.get("API_KEY")});

const token = config.get("TELEGRAM_TOKEN");

const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/echo (.+)/, (msg, match) => {

    const chatId = msg.chat.id;
    const resp = match[1];

    bot.sendMessage(chatId, resp);
});


bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    try{
        const stream = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "assistant", content: msg.text }]
        });
        console.log(JSON.stringify(stream.choices,null,2))
        await bot.sendMessage(chatId,stream.choices[0]?.message?.content || "")

    }catch (e) {
        console.log(e.message)
    }
    // try {
    //     bot.sendMessage(chatId, JSON.stringify(msg,null,2));
    //     if(msg.voice){
    //         bot.sendVoice(chatId,msg.voice.file_id);
    //     }
    // }catch (e) {
    //     console.log(e.message)
    // }

});