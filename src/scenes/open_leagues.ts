import {Markup, Scenes} from 'telegraf';
import {MyContext} from "../types";
import {sendMainMenu} from "../commands/main_menu";
import {getBOL, Koleika} from "../parse/bol";
import {getLoginCookie} from "../cookieGetter";

export const OPEN_LEAGUES_SCENE = 'OPEN_LEAGUES_SCENE';

export async function enterOpenLeaguesScene(ctx: MyContext) {
    await ctx.scene.enter(OPEN_LEAGUES_SCENE)
}

function createKoleikaString(ctx: MyContext, k: Koleika, showAll: boolean) {
    const prefix = showAll ? k.order + " - " : ""
    const suffix = k.registered ? "✅" : "➖";

    const date = new Date(k.date)
    const options: Intl.DateTimeFormatOptions = {weekday: "short", year: '2-digit', month: 'long', day: 'numeric'};
    const locale = ctx.getDict().locale;
    const dateInLocale = date.toLocaleDateString(locale, options);
    return prefix + dateInLocale + " " + suffix;
}

async function createLeagueMenu(ctx: MyContext, showAll: boolean) {
    const bol = await getBOL(ctx);
    const koleikaButtons = [[ctx.getDict().main_menu]]
    for (const koleika of bol.koleikas) {
        const futureLeague = new Date(koleika.date).valueOf() > Date.now().valueOf();
        if (futureLeague || showAll) {
            const description = createKoleikaString(ctx, koleika, showAll);
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

function getStringRepresantations(ctx: MyContext, k: Koleika): string[] {
    return [createKoleikaString(ctx, k, false), createKoleikaString(ctx, k, true)];
}

export async function getKoleikaFromMessage(ctx: MyContext, text: string): Promise<Koleika | null> {
    const bol = await getBOL(ctx);
    const stringReprsArray = bol.koleikas.flatMap(k => getStringRepresantations(ctx, k).map<[string, Koleika]>(repr => [repr, k]));
    const res = stringReprsArray.filter(x => x[0] === text)
    if (res.length > 1) {
        await ctx.reply(ctx.getDict().internal_error);
        throw new Error("non-unique koleika representation strings. can't determine koleika id");
    } else if (res.length == 0) {
        return null
    } else {
        return res[0][1];
    }
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
    } else {
        if (k.registered) {
            await ctx.reply(ctx.getDict().successfully_unregistered);
        } else {
            await ctx.reply(ctx.getDict().successfully_registered);
        }
    }
}

export function openLeaguesScene() {
    const openLeague = new Scenes.BaseScene<MyContext>(OPEN_LEAGUES_SCENE);
    openLeague.enter(async (ctx: MyContext) => {
        await openLeaguesCommand(ctx);
    });

    openLeague.on("message", async (ctx: MyContext) => {
            if (ctx.message.from.is_bot) {
                return
            }
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
                if (!ctx.isLoggedIn()) {
                    await ctx.sendMessage(ctx.getDict().need_login_to_register_for_the_leagues);
                    await ctx.scene.leave();
                    await sendMainMenu(ctx);
                }
                await switchRegistration(ctx, koleika);
                await openLeaguesCommand(ctx);
            } else if (text == ctx.getDict().look_all_open_leagues) {
                await ctx.scene.leave();
                await allOpenLeaguesCommand(ctx);
            } else {
                await ctx.reply(ctx.getDict().unknown_command);
                await sendMainMenu(ctx);
                await ctx.scene.leave();
            }
        }
    )

    return openLeague;
}
