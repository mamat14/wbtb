// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {NextApiRequest, NextApiResponse} from "next";
import {Context, Markup, Telegraf} from "telegraf";
import {BotDictionary, dicts} from "../../src/text/dicts";
import {getBOL, getOpenLeagueHtml, League, parseKoleikiTable} from "./test";

const {message} = require('telegraf/filters');

type CallContext = {
    dict: BotDictionary
}

const users = {}

// fetch("https://hastalavista.pl/moje-konto/", {
//   "credentials": "include",
//   "headers": {
//     "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/109.0",
//     "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
//     "Accept-Language": "en-US,en;q=0.5",
//     "Content-Type": "application/x-www-form-urlencoded",
//     "Upgrade-Insecure-Requests": "1",
//     "Sec-Fetch-Dest": "document",
//     "Sec-Fetch-Mode": "navigate",
//     "Sec-Fetch-Site": "same-origin",
//     "Sec-Fetch-User": "?1"
//   },
//   "referrer": "https://hastalavista.pl/moje-konto/",
//   "body": "_wpmem_login_nonce=bd389737e1&_wp_http_referer=%2Fmoje-konto%2F&log=maracuia&pwd=m7dQWCh9%407ew&redirect_to=%2Fmoje-konto%2F&a=login&Submit=Log+in",
//   "method": "POST",
//   "mode": "cors"
// });
//
// await fetch("https://hastalavista.pl/wp-admin/admin-ajax.php", {
//   "credentials": "include",
//   "headers": {
//     "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/109.0",
//     "Accept": "*/*",
//     "Accept-Language": "en-US,en;q=0.5",
//     "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
//     "X-Requested-With": "XMLHttpRequest",
//     "Sec-Fetch-Dest": "empty",
//     "Sec-Fetch-Mode": "cors",
//     "Sec-Fetch-Site": "same-origin"
//   },
//   "referrer": "https://hastalavista.pl/dyscypliny/badminton/liga-open/lista-zgloszen/",
//   "body": "action=LigiZapisyShow&kole_id=8563247&liga_id=8563081",
//   "method": "POST",
//   "mode": "cors"
// });


async function createLeagueMenu(ctx: CallContext) {
    const bol = await getBOL();
    const koleikaButtons = [[ctx.dict.main_menu]]
    for (const koleika of bol.koleikas) {
        if(koleikaButtons[koleikaButtons.length - 1].length <= 3) {
            koleikaButtons[koleikaButtons.length - 1].push(koleika.description);
        } else {
            koleikaButtons.push([koleika.description])
        }
    }
    return Markup.keyboard(koleikaButtons).resize();
}

function createBot(userContext: CallContext) {
    const bot = new Telegraf(process.env.BOT_TOKEN);
    const dict = userContext.dict;
    const MAIN_MENU = Markup.keyboard([
        [dict.look_open_leagues]
    ]).resize();

    bot.start((ctx) => ctx.reply(dict.greet, MAIN_MENU));

    bot.hears(dict.look_open_leagues, async (ctx: Context) => {
        const leagueMenu = await createLeagueMenu(userContext);
        await ctx.reply(dict.high_here_are_your_league, leagueMenu);
    })

    bot.help((ctx) => ctx.reply(dict.main_menu, MAIN_MENU));
    // bot.on(message('sticker'), (ctx: Context) => ctx.reply('👍'));
    // bot.hears('hi', (ctx: Context) => ctx.reply('Hey there'));
    // bot.on(message("text"), (ctx: Context) => ctx.reply("Hello"));


    return bot;
}

function checkSecurity(req: NextApiRequest) {
    return req.headers["X-Telegram-Bot-Api-Secret-Token".toLowerCase()] !== process.env.BOT_SECRET;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const bot = createBot({dict: dicts.ru});

    if (req.method === "POST") {
        if (checkSecurity(req)) {
            throw new Error("Not Found");
        } else {
            await bot.handleUpdate(req.body, res);
        }
    } else {
        res.json({"hello": "world"});
    }
}
