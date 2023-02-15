import {Scenes} from 'telegraf';
import {MyContext} from "../types";
import {sendMainMenu} from "../commands/main_menu";

export const LOGIN_DATA_WIZARD_SCENE_ID = 'LOGIN_DATA_WIZARD_SCENE';

export async function startLogin(ctx: MyContext) {
    await ctx.scene.enter(LOGIN_DATA_WIZARD_SCENE_ID);
}

export const loginDataWizard = new Scenes.WizardScene<MyContext>(
    LOGIN_DATA_WIZARD_SCENE_ID,
    async (ctx: MyContext) => {
        if(ctx.message.from.is_bot) {
            return ;
        }

        // validation example
        ctx.session.loginData = {};

        const msg = ctx.message
        if (!("text" in msg) || msg.text.length < 2) {
            await ctx.reply(ctx.getDict().enter_hasta_website_login);
        } else {
            ctx.session.loginData.login = msg.text;
            ctx.reply(ctx.getDict().enter_hasta_website_pwd);
            return ctx.wizard.next();
        }
    },
    async (ctx: MyContext) => {
        if(ctx.message.from.is_bot) {
            return ;
        }

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
