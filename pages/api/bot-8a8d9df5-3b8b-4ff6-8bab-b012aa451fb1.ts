// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {NextApiRequest, NextApiResponse} from "next";
import {Scenes, session, Telegraf} from "telegraf";
import {loginDataWizard, startLogin} from "../../src/scenes/login";
import {MyContext} from "../../src/types";
import {getMongoSessionStore} from "../../src/mongoSessionStore";
import {getMongoClient} from "../../src/mongodb";
import {openLeagueCommand} from "../../src/commands/open_league";
import {cmds} from "../../src/commands/names";
import {sendMainMenu} from "../../src/commands/main_menu";
import {startBot} from "../../src/commands/start";


async function createBot() {
    const bot = new Telegraf<MyContext>(process.env.BOT_TOKEN, {contextType: MyContext});

    bot.start(startBot);
    bot.help(sendMainMenu);
    bot.command(cmds.main_menu, sendMainMenu)
    bot.hears(cmds.main_menu, sendMainMenu)
    bot.hears(cmds.look_OL, openLeagueCommand)
    bot.hears(cmds.login, startLogin)

    //сессия
    const mongoClient = await getMongoClient();
    const sessionStore = getMongoSessionStore(mongoClient)
    bot.use(session({store: sessionStore}));

    //сцены
    const stage = new Scenes.Stage<MyContext>([loginDataWizard]);
    bot.use(stage.middleware());

    return bot;
}

function checkSecurity(req: NextApiRequest) {
    return req.headers["X-Telegram-Bot-Api-Secret-Token".toLowerCase()] !== process.env.BOT_SECRET;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const bot = await createBot();

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
