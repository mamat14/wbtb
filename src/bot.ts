import {Scenes, session, Telegraf} from "telegraf";
import {MyContext} from "./types";
import {startBot} from "./commands/start";
import {sendMainMenu} from "./commands/main_menu";
import {loginDataWizard, startLogin} from "./scenes/login";
import {getMongoClient} from "./mongodb";
import {getMongoSessionStore, getSessionId} from "./mongoSessionStore";
import {changeLanguage, chooseLanguageScene} from "./scenes/choose_language";
import {dicts} from "./text/dicts";
import {message} from "telegraf/filters";
import {openLeaguesScene, enterOpenLeaguesScene} from "./scenes/open_leagues";
import {logoutDataWizard, startLogout} from "./scenes/logout";
import {sendRankings} from "./commands/rankings";
import {sendResultsOfKoleika} from "./commands/league_results";

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

        ctx.isLoggedIn = function () {
            return !!ctx?.session?.loginData?.login && !!ctx?.session?.loginData?.pwd
        }
        await next();
    })

    //сессия
    const mongoClient = await getMongoClient();
    const sessionStore = getMongoSessionStore(mongoClient)
    await bot.use(session({store: sessionStore, getSessionKey: getSessionId}));

    //сцены
    const stage = new Scenes.Stage<MyContext>([loginDataWizard, chooseLanguageScene, openLeaguesScene(), logoutDataWizard]);
    await bot.use(stage.middleware());

    //other stuff
    await bot.start(startBot);
    await bot.help(sendMainMenu);
    await bot.command("main_menu", sendMainMenu)
    await bot.on(message('text'), async (ctx: MyContext) => {
        const msg = ctx.message
        if (!("text" in msg)) {
            throw new Error("expected message")
        }
        const text = msg.text;

        if (!ctx.session.dictId) {
            await changeLanguage(ctx);
            return;
        }

        if (text == ctx.getDict().main_menu) {
            await sendMainMenu(ctx)
        } else if (text == ctx.getDict().login) {
            await startLogin(ctx)
        } else if (text == ctx.getDict().logout) {
            await startLogout(ctx);
        } else if (text == ctx.getDict().look_future_open_leagues) {
            await enterOpenLeaguesScene(ctx)
        } else if (text === ctx.getDict().choose_language) {
            await changeLanguage(ctx);
        } else if(text == ctx.getDict().get_rankings) {
            await sendRankings(ctx)
        } else if(text == ctx.getDict().view_league_results) {
            await sendResultsOfKoleika(ctx);
        } else {
            await ctx.reply(ctx.getDict().unknown_command);
        }

        //set up-to-date commands
        await ctx.telegram.setMyCommands([
            {command: "main_menu", description: ctx.getDict().main_menu}
        ]);
    })

    return bot;
}
