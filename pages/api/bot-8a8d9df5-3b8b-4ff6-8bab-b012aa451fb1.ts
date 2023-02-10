// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {NextApiRequest, NextApiResponse} from "next";
import {Context, Telegraf} from "telegraf";
import {dicts} from "../../src/text/dicts";

const {message} = require('telegraf/filters');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const bot = new Telegraf(process.env.BOT_TOKEN);

  bot.start((ctx) => ctx.reply(dicts.ru.greet));
  bot.command("schedule", (ctx: Context) => {
    ctx.sendMessage("Привет")
  })
  // bot.help((ctx) => ctx.reply('Send me a sticker'));
  // bot.on(message('sticker'), (ctx: Context) => ctx.reply('👍'));
  // bot.hears('hi', (ctx: Context) => ctx.reply('Hey there'));
  // bot.on(message("text"), (ctx: Context) => ctx.reply("Hello"));

  if(req.method === "POST") {
    await bot.handleUpdate(req.body, res);
  } else {
    res.json({"hello": "world"});
  }
}
