import {Markup, Scenes} from 'telegraf';
import {MyContext} from "../types";
import {sendMainMenu} from "../commands/main_menu";
import {getBOL, Koleika} from "../parse/bol";
import {getLoginCookie} from "../cookieGetter";

export const OPEN_LEAGUES_SCENE = 'OPEN_LEAGUES_SCENE';

export async function enterOpenLeaguesScene(ctx: MyContext) {
    ctx.scene.enter(OPEN_LEAGUES_SCENE)
}

function createKoleikaString(ctx: MyContext, k: Koleika) {
    const date = new Date(k.date)
    const options: Intl.DateTimeFormatOptions = {weekday: "short", year: '2-digit', month: 'long', day: 'numeric'};
    const locale = ctx.getDict().locale;
    return date.toLocaleDateString(locale, options);
}

async function createLeagueMenu(ctx: MyContext, showAll: boolean) {
    const bol = await getBOL(ctx);
    const koleikaButtons = [[ctx.getDict().main_menu]]
    for (const koleika of bol.koleikas) {
        const futureLeague = new Date(koleika.date).valueOf() > Date.now().valueOf();
        if (futureLeague || showAll) {
            const prefix = showAll ? koleika.order + " - " : ""
            const suffix = koleika.registered ? "✅" : "➖";
            const dateLocal = createKoleikaString(ctx, koleika);

            const description = prefix + dateLocal + " " + suffix;
            koleikaButtons.push([description])
        }
    }
    if (showAll) {
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

async function getKoleikaFromMessage(ctx: MyContext, text: string): Promise<Koleika | null> {
    const bol = await getBOL(ctx)
    if (!ctx.isLoggedIn()) {
        return null;
    }
    const koleikaMap = Object.fromEntries(bol.koleikas.map(k => [createKoleikaString(ctx, k), k]));
    if (!(bol.koleikas.length === Object.keys(koleikaMap).length)) {
        await ctx.reply(ctx.getDict().internal_error);
        throw new Error("non-unique koleika representation strings. can't determine koleika id");
    }
    return koleikaMap[text] || null;
}

async function switchRegistration(ctx: MyContext, k: Koleika): Promise<void> {
    if (k.registered === undefined) {
        await ctx.sendMessage(ctx.getDict().need_login_to_register_for_the_leagues);
        await ctx.scene.leave();
        await sendMainMenu(ctx);
    }
    const operation = k.registered ? "usun" : "dodaj"
    const body = `action=LigiZapisyZapisz&liga_id=${k.league_id}&kole_id=${k.id}&oper=${operation}`;
    const cookie = await getLoginCookie(ctx);
    const response = await fetch("https://hastalavista.pl/wp-admin/admin-ajax.php", {
        "headers": {
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.5",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Cookie": cookie
        },
        "referrer": "https://hastalavista.pl/dyscypliny/badminton/liga-open/lista-zgloszen/",
        "body": body,
        "method": "POST",
    });
    if (!response.ok) {
        await ctx.reply(ctx.getDict().internal_error);
    }
    await openLeaguesCommand(ctx);
}

export function openLeaguesScene() {
    const openLeague = new Scenes.BaseScene<MyContext>(OPEN_LEAGUES_SCENE);
    openLeague.enter(async (ctx: MyContext) => {
        await openLeaguesCommand(ctx);
    });

    openLeague.on("message", ctx => {
            async (ctx: MyContext) => {
                const msg = ctx.message
                if (!("text" in msg)) {
                    await ctx.reply(ctx.getDict().unknown_command);
                    await ctx.scene.leave();
                    await sendMainMenu(ctx);
                    return;
                }
                const text = msg.text;
                const koleika = await getKoleikaFromMessage(ctx, text);

                if (text == ctx.getDict().main_menu) {
                    await sendMainMenu(ctx);
                    await ctx.scene.leave();
                } else if (koleika) {
                    await switchRegistration(ctx, koleika);
                } else if (text == ctx.getDict().look_all_open_leagues) {
                    await ctx.scene.leave();
                    await allOpenLeaguesCommand(ctx);
                } else {
                    await sendMainMenu(ctx);
                    ctx.scene.leave();
                }
            }
        }
    )

    return openLeague;
}
