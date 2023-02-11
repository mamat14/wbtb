import {Scenes} from 'telegraf';
import {MyContext} from "../types";

export const LOGIN_DATA_WIZARD_SCENE_ID = 'LOGIN_DATA_WIZARD_SCENE';
export async function startLogin(ctx: MyContext) {
    ctx.scene.enter(LOGIN_DATA_WIZARD_SCENE_ID)
}
export const loginDataWizard = new Scenes.WizardScene<MyContext>(
    LOGIN_DATA_WIZARD_SCENE_ID,
    async (ctx: MyContext) => {
        await ctx.reply(ctx.getDict().enter_hasta_website_login);
        ctx.session.loginData = {};
        return ctx.wizard.next();
    },
    async (ctx: MyContext) => {
        // validation example
        if(!("text" in ctx.message)) {
            throw new Error("No text in message")
        }
        if (ctx.message.text.length < 2) {
            await ctx.reply(ctx.getDict().enter_hasta_website_login);
            return;
        }
        ctx.session.loginData.login = ctx.message.text;
        ctx.reply(ctx.getDict().enter_hasta_website_pwd);
        return ctx.wizard.next();
    },
    async (ctx: MyContext) => {
        if(!("text" in ctx.message)) {
            throw new Error("No text in message")
        }

        if (ctx.message.text.length < 2) {
            await ctx.reply(ctx.getDict().enter_hasta_website_pwd);
            return;
        }
        ctx.session.loginData.pwd = ctx.message.text;
        await ctx.reply(ctx.getDict().thank_you_for_login);

        return ctx.scene.leave();
    },
);
