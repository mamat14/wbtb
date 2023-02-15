import {parse, HTMLElement} from 'node-html-parser';
import {MyContext} from "../types";
import {getLoginCookie} from "../cookieGetter";

export type League = {
    id: number,
    name: string,
    koleikas: Koleika[]
}
export type Koleika = {
    id: number,
    league_id: number
    date: string,
    order: number,
    registered?: boolean
};

const BADMINTON_OPEN_LEAGUE_ID = 8563081;
const BADMINTON_OPEN_LEAGUE_NAME = "BADMINTON_OPEN_LEAGUE";

function getKoleika(label: HTMLElement): Koleika {
    const idWithPrefix = label.getAttribute("for");
    const id = parseInt(idWithPrefix.substring("rez_kole_id".length));
    const description = label.innerText;
    const [orderStr, date] = description.trim()
        .split(" - ")
        .map(x => x.trim())
        .filter((x) => x.length !== 0);
    const order = parseInt(orderStr);
    return {id, date, order, league_id: BADMINTON_OPEN_LEAGUE_ID};
}

function getKoleikaCheckMark(label: HTMLElement): [number, boolean] {
    const idWithPrefix = label.getAttribute("for");
    const id = parseInt(idWithPrefix.substring("rez_kole_id_c_".length));
    const isRegistered = label.innerText.includes("&#10004");
    console.log(id, isRegistered);
    return [id, isRegistered];
}

function getRegisteredMap(div: HTMLElement): Record<number, boolean> {
    console.log(div.innerText);
    const koleikasCheckmark = div.querySelectorAll("label").map(getKoleikaCheckMark);
    return Object.fromEntries(koleikasCheckmark);
}

function parseBadmintonOpenLeague(ctx: MyContext, root: HTMLElement): League {
    const checkMarkDiv = root.getElementById("rez_ligi_zapisy_kolejki_rd_div2")
    const registered = getRegisteredMap(checkMarkDiv);

    const dateDiv = root.getElementById("rez_ligi_zapisy_kolejki_rd_div");
    const koleikas = dateDiv.querySelectorAll("label")
        .map(getKoleika)
        .map(k => ({registered: registered[k.id], ...k}));

    const id = BADMINTON_OPEN_LEAGUE_ID;
    const name = BADMINTON_OPEN_LEAGUE_NAME;
    return {id, name, koleikas};
}

export async function getOpenLeagueHtml(ctx: MyContext) {
    console.log("getOpenLeagueHtml -> isLoggedIn:", ctx.isLoggedIn())
    if (!ctx.isLoggedIn()) {
        const response = await fetch("https://hastalavista.pl/dyscypliny/badminton/liga-open/lista-zgloszen/");
        return await response.text();
    } else {
        const cookie = await getLoginCookie(ctx);
        const response = await fetch("https://hastalavista.pl/dyscypliny/badminton/liga-open/lista-zgloszen/", {headers: {"cookie": cookie}});
        return await response.text();
    }
}

export async function getBOL(ctx: MyContext) {
    const text = await getOpenLeagueHtml(ctx);
    return parseBadmintonOpenLeague(ctx, parse(text));
}
