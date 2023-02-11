import {MyContext} from "../types";
import {Markup} from "telegraf";

export const sendMainMenu = async (ctx: MyContext) => {
    const lookLeagues = ctx.getDict().look_open_leagues;
    const login = ctx.getDict().login;
    const MAIN_MENU = Markup.keyboard([[lookLeagues], [login]]).resize();
    await ctx.reply(ctx.getDict().main_menu, MAIN_MENU)
}
