import {MyContext} from "../types";
import {getBOL} from "../parse/bol";
import {Markup} from "telegraf";

async function createLeagueMenu(ctx: MyContext, showAll: boolean) {
    const bol = await getBOL(ctx);
    const koleikaButtons = [[ctx.getDict().main_menu]]
    for (const koleika of bol.koleikas) {
        const futureLeague = new Date(koleika.date).valueOf() > Date.now().valueOf();
        if(futureLeague || showAll) {
            const suffix = koleika.registered ? "✅" : "➖";
            const description = koleika.order + " - " + koleika.date + " " + suffix;
            koleikaButtons.push([description])
        }
    }
    if(showAll) {
        koleikaButtons.push([ctx.getDict().look_future_open_leagues]);
    } else {
        koleikaButtons.push([ctx.getDict().look_all_open_leagues]);
    }
    return Markup.keyboard(koleikaButtons).resize().oneTime();
}

export async function openLeaguesCommand(ctx: MyContext) {
    const leagueMenu = await createLeagueMenu(ctx, false);
    await ctx.reply(ctx.getDict().high_here_are_your_league, leagueMenu);
}

export async function allOpenLeaguesCommand(ctx: MyContext) {
    const leagueMenu = await createLeagueMenu(ctx, true);
    await ctx.reply(ctx.getDict().high_here_are_your_league, leagueMenu);
}
