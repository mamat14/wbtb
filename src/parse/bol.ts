import { parse, HTMLElement, Node } from 'node-html-parser';
import {MyContext} from "../types";

export type League = {
    id: number,
    name: string,
    koleikas: Koleika[]
}
export type Koleika = {
    id: number,
    description: string,
    registered?: boolean
};

const BADMINTON_OPEN_LEAGUE_ID = 8563081;
const BADMINTON_OPEN_LEAGUE_NAME = "BADMINTON_OPEN_LEAGUE";

function getKoleika(label: HTMLElement): Koleika {
    const idWithPrefix = label.getAttribute("for");
    const id = parseInt(idWithPrefix.substring("rez_kole_id".length));
    const description = label.innerText;
    return {id, description};
}

function parseBadmintonOpenLeague(ctx: MyContext, root: HTMLElement): League {
    const dateDiv = root.getElementById("rez_ligi_zapisy_kolejki_rd_div");
    const koleikas = dateDiv.querySelectorAll("label").map(getKoleika);
    const id = BADMINTON_OPEN_LEAGUE_ID;
    const name = BADMINTON_OPEN_LEAGUE_NAME;
    return {id, name, koleikas};
}

export async function getOpenLeagueHtml(ctx: MyContext) {

    const resp = await fetch("https://hastalavista.pl/dyscypliny/badminton/liga-open/lista-zgloszen/");
    return await resp.text();
}

export async function getBOL(ctx: MyContext) {
    const text = await getOpenLeagueHtml();
    return parseBadmintonOpenLeague(ctx, parse(text));
}
