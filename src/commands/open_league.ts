import {MyContext} from "../types";
import {getBOL} from "../parse/bol";
import {Markup} from "telegraf";

async function createLeagueMenu(ctx: MyContext) {
    const bol = await getBOL(ctx);
    const koleikaButtons = [[ctx.getDict().main_menu]]
    for (const koleika of bol.koleikas) {
        const prefix = koleika.registered ? "✅" : "➖";
        const description = prefix + koleika.date
        if (koleikaButtons[koleikaButtons.length - 1].length <= 3) {
            koleikaButtons[koleikaButtons.length - 1].push(description);
        } else {
            koleikaButtons.push([description])
        }
    }
    return Markup.keyboard(koleikaButtons).resize().oneTime();
}

export async function openLeagueCommand(ctx: MyContext) {
    const leagueMenu = await createLeagueMenu(ctx);
    await ctx.reply(ctx.getDict().high_here_are_your_league, leagueMenu);
}
