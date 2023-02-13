import {MyContext} from "../types";
import {getBOL} from "../parse/bol";
import {Markup} from "telegraf";

async function createLeagueMenu(ctx: MyContext, showAll: boolean) {
    const bol = await getBOL(ctx);
    const koleikaButtons = [[ctx.getDict().main_menu]]
    for (const koleika of bol.koleikas) {
        const futureLeague = new Date(koleika.date).valueOf() > Date.now().valueOf();
        if(futureLeague || showAll) {
            const prefix = showAll ? koleika.order + " - " : ""
            const suffix = koleika.registered ? "✅" : "➖";
            const date = new Date(koleika.date);
            const options: Intl.DateTimeFormatOptions = { weekday: "short", year: '2-digit', month: 'long', day: 'numeric' };
            const locale = ctx.getDict().locale;
            const dateLocal = date.toLocaleDateString(locale, options)

            const description = prefix + dateLocal + " " + suffix;
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
    await ctx.reply(ctx.getDict().high_here_are_the_leagues, leagueMenu);
}

export async function allOpenLeaguesCommand(ctx: MyContext) {
    const leagueMenu = await createLeagueMenu(ctx, true);
    await ctx.reply(ctx.getDict().high_here_are_the_leagues, leagueMenu);
}
