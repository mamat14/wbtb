import {MyContext} from "../types";
import {Markup} from "telegraf";

export const sendMainMenu = async (ctx: MyContext) => {
    const lookLeagues = ctx.getDict().look_future_open_leagues;
    const login = ctx.isLoggedIn() ? [] : [ctx.getDict().login];
    const actions = [[lookLeagues], login].flatMap(x => x).map(k => [k])
    const MAIN_MENU = Markup.keyboard(actions).resize();
    await ctx.reply(ctx.getDict().main_menu, MAIN_MENU)
}
