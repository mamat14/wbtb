import {Markup, Scenes} from 'telegraf';
import {MyContext} from "../types";
import {sendMainMenu} from "../commands/main_menu";

export const LOGOUT_DATA_WIZARD_SCENE_ID = 'LOGOUT_DATA_WIZARD_SCENE_ID';

export async function startLogout(ctx: MyContext) {
    await ctx.scene.enter(LOGOUT_DATA_WIZARD_SCENE_ID);
}

export const loginDataWizard = new Scenes.WizardScene<MyContext>(
    LOGOUT_DATA_WIZARD_SCENE_ID,
    async (ctx: MyContext) => {
        const keyboard = Markup.keyboard([[ctx.getDict().yes, ctx.getDict().no]]).resize().oneTime();
        await ctx.reply(ctx.getDict().are_you_sure_to_logout, keyboard);
        await ctx.wizard.next();
    },
    async (ctx: MyContext) => {
        const msg = ctx.message
        if("text" in msg && msg.text === ctx.getDict().yes) {
            ctx.session.loginData = {};
            await ctx.reply(ctx.getDict().successfully_logged_out);
            await sendMainMenu(ctx);
        } else if("text" in msg && msg.text === ctx.getDict().no) {
            await ctx.scene.leave();
            await sendMainMenu(ctx);
        } else {
            const keyboard = Markup.keyboard([[ctx.getDict().yes, ctx.getDict().no]]).resize().oneTime();
            await ctx.reply(ctx.getDict().enter_yes_or_no, keyboard);
        }
    },
    async (ctx: MyContext) => {
        const msg = ctx.message
        if (!("text" in msg) || msg.text.length < 2) {
            await ctx.reply(ctx.getDict().enter_hasta_website_pwd);
        } else {
            ctx.session.loginData.pwd = msg.text;
            await ctx.reply(ctx.getDict().thank_you_for_login);
            await sendMainMenu(ctx);
            return ctx.scene.leave();
        }
    },
);
