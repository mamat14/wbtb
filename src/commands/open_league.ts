import {MyContext} from "../types";
import {getBOL} from "../parse/bol";
import {Markup} from "telegraf";

async function createLeagueMenu(ctx: MyContext) {
    const bol = await getBOL(ctx);
    const koleikaButtons = [[ctx.getDict().main_menu]]
    for (const koleika of bol.koleikas) {
        const suffix = koleika.registered ? "✅" : "➖";
        const description = koleika.order + " - " + koleika.date + " " + suffix;
        koleikaButtons.push([description])
    }
    return Markup.keyboard(koleikaButtons).resize().oneTime();
}

export async function openLeagueCommand(ctx: MyContext) {
    const leagueMenu = await createLeagueMenu(ctx);
    await ctx.reply(ctx.getDict().high_here_are_your_league, leagueMenu);
}
