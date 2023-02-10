// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {NextApiRequest, NextApiResponse} from "next";
import {Context, Markup, Telegraf} from "telegraf";
import {BotDictionary, dicts} from "../../src/text/dicts";
import {getBOL} from "./test";

type CallContext = {
    dict: BotDictionary
}

async function createLeagueMenu(ctx: CallContext) {
    const bol = await getBOL();
    const koleikaButtons = [[ctx.dict.main_menu]]
    for (const koleika of bol.koleikas) {
        if (koleikaButtons[koleikaButtons.length - 1].length <= 3) {
            koleikaButtons[koleikaButtons.length - 1].push(koleika.description);
        } else {
            koleikaButtons.push([koleika.description])
        }
    }
    return Markup.keyboard(koleikaButtons).resize();
}

type Command = "look_open_leagues";
const commandNames: Record<Command, string> = {
    look_open_leagues: "look_open_leagues"
}

function createBot(userContext: CallContext) {
    const bot = new Telegraf(process.env.BOT_TOKEN);
    const dict = userContext.dict;
    const MAIN_MENU = Markup.keyboard([[dict.look_open_leagues]]).resize();

    //1
    bot.start((ctx) => {
        ctx.setMyCommands([{command: "main_menu", description: dict.main_menu}]);
        ctx.reply(dict.greet, MAIN_MENU);
    });

    bot.command("main_menu", (ctx) => {
        ctx.reply(dict.main_menu, MAIN_MENU)
    })

    bot.help((ctx) => ctx.reply(dict.main_menu, MAIN_MENU));


    //просмотр всех лиг
    bot.hears(dict.look_open_leagues, async (ctx) => {
        const leagueMenu = await createLeagueMenu(userContext);
        await ctx.reply(dict.high_here_are_your_league, leagueMenu);
    })

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
