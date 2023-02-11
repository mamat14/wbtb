// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {NextApiRequest, NextApiResponse} from "next";
import {Context, Markup, Scenes, session, Telegraf} from "telegraf";
import {LOGIN_DATA_WIZARD_SCENE_ID, loginDataWizard} from "../../src/scenes/login";
import {MyContext} from "../../src/types";
import {getMongoSessionStore} from "../../src/mongoSessionStore";
import {getMongoClient} from "../../src/mongodb";
import {getBOL} from "../../src/parse/bol";

async function createLeagueMenu(ctx: MyContext) {
    const bol = await getBOL();
    const koleikaButtons = [[ctx.ses.dict.main_menu]]
    for (const koleika of bol.koleikas) {
        if (koleikaButtons[koleikaButtons.length - 1].length <= 3) {
            koleikaButtons[koleikaButtons.length - 1].push(koleika.description);
        } else {
            koleikaButtons.push([koleika.description])
        }
    }
    return Markup.keyboard(koleikaButtons).resize();
}

type Commands = "login" | "main_menu" | "look_OL";
const cmds: Record<Commands, Commands> = {
    look_OL: "look_OL",
    login: "login",
    main_menu: "main_menu"
}

async function createBot() {
    const bot = new Telegraf<MyContext>(process.env.BOT_TOKEN);
    const sendMainMenu = async (ctx: MyContext) => {
        const msg1 = ctx.ses.dict.look_open_leagues + `(${cmds.look_OL})`;
        const msg2 = ctx.ses.dict.login +`(${cmds.look_OL})`;
        const MAIN_MENU = Markup.keyboard([[msg1], [msg2]]).resize();
        await ctx.reply(ctx.ses.dict.main_menu, MAIN_MENU)
    }

    //1
    bot.start(async (ctx: MyContext) => {
        await ctx.telegram.setMyCommands([
            {command: cmds.main_menu, description: ctx.ses.dict.main_menu}
        ]);
        await sendMainMenu(ctx);
    });

    bot.command("main_menu", sendMainMenu)
    bot.help(sendMainMenu);

    //команді
    bot.hears(cmds.look_OL, async (ctx) => {
        const leagueMenu = await createLeagueMenu(ctx);
        await ctx.reply(ctx.ses.dict.high_here_are_your_league, leagueMenu);
    })
    bot.hears(cmds.login, async (ctx: MyContext) => {
        ctx.scene.enter(LOGIN_DATA_WIZARD_SCENE_ID);
    })

    //сцены
    const stage = new Scenes.Stage<MyContext>([loginDataWizard]);
    const mongoClient = await getMongoClient();
    const sessionStore = getMongoSessionStore(mongoClient)
    bot.use(session({store: sessionStore}));
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
