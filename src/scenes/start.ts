import {Markup, Scenes} from 'telegraf';
import {MyContext} from "../types";
import {DictKey, dicts, langNames} from "../text/dicts";
import {sendMainMenu} from "../commands/main_menu";

export const CHOOSE_LANGUAGE_SCENE = 'START_BOT_SCENE_ID';

export async function startBotScene(ctx: MyContext) {
    await ctx.scene.enter(CHOOSE_LANGUAGE_SCENE);
}

const plsEnterLang = Object.values(dicts).map(x => x.enter_preffered_language_pls).join("\n");
const languages = Object.values(langNames).map(x => [x]);
const languagesKeyboard = Markup.keyboard(languages).resize().oneTime();

export const chooseLanguageScene = new Scenes.WizardScene<MyContext>(
    CHOOSE_LANGUAGE_SCENE,
    async (ctx: MyContext) => {
        await ctx.reply(plsEnterLang, languagesKeyboard);
        await ctx.wizard.next();
    },
    async (ctx: MyContext) => {
        const msg = ctx.message;
        if (!("text" in msg)) {
            return await ctx.reply(plsEnterLang, languagesKeyboard);
        } else {
            const language = Object.entries(langNames).find(x => x[1] === msg.text)
            if (!language) {
                return await ctx.reply(plsEnterLang, languagesKeyboard);
            }
            ctx.session.dictId = language[0] as DictKey;

            return await ctx.wizard.next();
        }
    },
    async (ctx: MyContext) => {
        await ctx.sendMessage(ctx.getDict().thank_you);
        await ctx.telegram.setMyCommands([
            {command: "main_menu", description: ctx.getDict().main_menu}
        ]);
        await ctx.scene.leave();
        await sendMainMenu(ctx);
    }
);
