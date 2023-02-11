import {Scenes} from 'telegraf';
import {MyContext} from "../types";

export const LOGIN_DATA_WIZARD_SCENE_ID = 'LOGIN_DATA_WIZARD_SCENE';

export const loginDataWizard = new Scenes.WizardScene<MyContext>(
    LOGIN_DATA_WIZARD_SCENE_ID,
    async (ctx: MyContext) => {
        await ctx.reply(ctx.ses.dict.enter_hasta_website_login);
        ctx.session.loginData = {};
        return ctx.wizard.next();
    },
    async (ctx: MyContext) => {
        // validation example
        if (ctx.message.text.length < 2) {
            await ctx.reply(ctx.session.dict.enter_hasta_website_login);
            return;
        }
        ctx.session.loginData.login = ctx.message.text;
        ctx.reply(ctx.ses.dict.enter_hasta_website_pwd);
        return ctx.wizard.next();
    },
    async (ctx: MyContext) => {
        if (ctx.message.text.length < 2) {
            await ctx.reply(ctx.ses.dict.enter_hasta_website_pwd);
            return;
        }
        ctx.session.loginData.pwd = ctx.message.text;
        await ctx.reply(ctx.ses.dict.thank_you_for_login);

        return ctx.scene.leave();
    },
);
