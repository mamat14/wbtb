// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {NextApiRequest, NextApiResponse} from "next";
import {Context, Telegraf} from "telegraf";
import {dicts} from "../../src/text/dicts";

const {message} = require('telegraf/filters');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const bot = new Telegraf(process.env.BOT_TOKEN);

  bot.start((ctx) => ctx.reply(dicts.ru.greet));
  bot.help((ctx) => ctx.reply('Send me a sticker'));
  bot.on(message('sticker'), (ctx: Context) => ctx.reply('👍'));
  bot.hears('hi', (ctx: Context) => ctx.reply('Hey there'));
  bot.on(message("text"), (ctx: Context) => ctx.reply("Hello"));

// Start webhook via launch method (preferred)
  await bot.launch({
    webhook: {
      domain: process.env.VERCEL_URL,
      port: 8080,
      hookPath: "/api/bot-8a8d9df5-3b8b-4ff6-8bab-b012aa451fb1",
      secretToken: process.env.BOT_SECRET,
    },
  })

  if(req.method === "POST") {
    await bot.handleUpdate(req.body, res);
  } else {
    res.json({"hello": "world"});
  }
}
