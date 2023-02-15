import {Markup, Scenes} from 'telegraf';
import {MyContext} from "../types";
import {DictKey, dicts, langNames} from "../text/dicts";
import {sendMainMenu} from "../commands/main_menu";

export const START_BOT_SCENE_ID = 'START_BOT_SCENE_ID';

export async function startBotScene(ctx: MyContext) {
    await ctx.scene.enter(START_BOT_SCENE_ID);
}

async function askLanguage(ctx: MyContext) {
    const msg = ctx.message;
    const plsEnterLang = Object.values(dicts).map(x => x.enter_preffered_language_pls).join("\n");
    const lanugages = Object.values(langNames).map(x => [x]);
    const languagesKeyboard = Markup.keyboard(lanugages).resize().oneTime();

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
}

export const startWizard = new Scenes.WizardScene<MyContext>(
    START_BOT_SCENE_ID,
    async (ctx: MyContext) => {
        if (!ctx.session.dictId) {
            return await askLanguage(ctx);
        } else {
            return await ctx.wizard.next();
        }
    },
    async (ctx: MyContext) => {
        await ctx.sendMessage(ctx.getDict().thank_you);
        await ctx.telegram.setMyCommands([
            {command: "main_menu", description: ctx.getDict().main_menu}
        ]);
        await sendMainMenu(ctx);
        return ctx.scene.leave();
    }
);
