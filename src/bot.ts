import {Scenes, session, Telegraf} from "telegraf";
import {MyContext} from "./types";
import {startBot} from "./commands/start";
import {sendMainMenu} from "./commands/main_menu";
import {cmds} from "./commands/names";
import {openLeagueCommand} from "./commands/open_league";
import {loginDataWizard, startLogin} from "./scenes/login";
import {getMongoClient} from "./mongodb";
import {getMongoSessionStore, getSessionId} from "./mongoSessionStore";
import {startWizard} from "./scenes/start";
import {dicts} from "./text/dicts";

export async function createBot() {
    const bot = new Telegraf<MyContext>(process.env.BOT_TOKEN);

    //patch bot
    await bot.use(async (ctx, next) => {
        ctx.getDict = function () {
            const dictId = ctx.session.dictId;
            if (dictId && dicts[dictId]) {
                return dicts[dictId]
            } else {
                throw new Error("dictId is not defined")
            }
        }
        await next();
    })

    //сессия
    const mongoClient = await getMongoClient();
    const sessionStore = getMongoSessionStore(mongoClient)
    await bot.use(session({store: sessionStore, getSessionKey: getSessionId}));

    //сцены
    const stage = new Scenes.Stage<MyContext>([loginDataWizard, startWizard]);
    await bot.use(stage.middleware());


    //other stuff
    await bot.start(startBot);
    await bot.help(sendMainMenu);
    await bot.command(cmds.main_menu, sendMainMenu)
    await bot.hears(cmds.main_menu, sendMainMenu)
    await bot.hears(cmds.look_OL, openLeagueCommand)
    await bot.hears(cmds.login, startLogin)


    return bot;
}
