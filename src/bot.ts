import {Scenes, session, Telegraf} from "telegraf";
import {MyContext} from "./types";
import {startBot} from "./commands/start";
import {sendMainMenu} from "./commands/main_menu";
import {cmds} from "./commands/names";
import {openLeagueCommand} from "./commands/open_league";
import {loginDataWizard, startLogin} from "./scenes/login";
import {getMongoClient} from "./mongodb";
import {getMongoSessionStore} from "./mongoSessionStore";
import {startWizard} from "./scenes/start";

export async function createBot() {
    const bot = new Telegraf<MyContext>(process.env.BOT_TOKEN);

    await bot.start(startBot);
    await bot.help(sendMainMenu);
    await bot.command(cmds.main_menu, sendMainMenu)
    await bot.hears(cmds.main_menu, sendMainMenu)
    await bot.hears(cmds.look_OL, openLeagueCommand)
    await bot.hears(cmds.login, startLogin)

    //сессия
    const mongoClient = await getMongoClient();
    const sessionStore = getMongoSessionStore(mongoClient)
    await bot.use(session({store: sessionStore}));

    //сцены
    const stage = new Scenes.Stage<MyContext>([loginDataWizard, startWizard]);
    await bot.use(stage.middleware());

    return bot;
}
