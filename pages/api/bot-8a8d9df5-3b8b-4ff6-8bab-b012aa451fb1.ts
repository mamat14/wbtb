// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {NextApiRequest, NextApiResponse} from "next";
import {Context, Telegraf} from "telegraf";
import {dicts} from "../../src/text/dicts";

const {message} = require('telegraf/filters');

function createBot() {
  const bot = new Telegraf(process.env.BOT_TOKEN);

  bot.start((ctx) => ctx.reply(dicts.ru.greet));
  bot.command("schedule", (ctx: Context) => {
    ctx.sendMessage("Привет 2")
  })



  // bot.help((ctx) => ctx.reply('Send me a sticker'));
  // bot.on(message('sticker'), (ctx: Context) => ctx.reply('👍'));
  // bot.hears('hi', (ctx: Context) => ctx.reply('Hey there'));
  // bot.on(message("text"), (ctx: Context) => ctx.reply("Hello"));


  return bot;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const bot = createBot();

  if(req.method === "POST") {
    if(req.headers["X-Telegram-Bot-Api-Secret-Token"] !== process.env.BOT_SECRET) {
      throw new Error("Not Found")
    } else {
      await bot.handleUpdate(req.body, res);
    }
  } else {
    res.json({"hello": "world"});
  }
}
