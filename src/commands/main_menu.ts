import {MyContext} from "../types";
import {Markup} from "telegraf";

export const sendMainMenu = async (ctx: MyContext) => {
    const lookLeagues = ctx.getDict().look_future_open_leagues;
    const loginOrLogout = ctx.isLoggedIn() ? ctx.getDict().logout : ctx.getDict().login;
    const actions = [[lookLeagues], [loginOrLogout, ctx.getDict().choose_language]];
    const MAIN_MENU = Markup.keyboard(actions).resize();
    await ctx.reply(ctx.getDict().main_menu, MAIN_MENU)
}
