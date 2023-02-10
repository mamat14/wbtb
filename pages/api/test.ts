import {NextApiRequest, NextApiResponse} from "next";
import { parse, HTMLElement, Node } from 'node-html-parser';

type League = {
    id: number,
    name: string,
    koleikas: Koleika[]
}
type Koleika = {
    id: number,
    description: string
};

const BADMINTON_OPEN_LEAGUE_ID = 8563081;
const BADMINTON_OPEN_LEAGUE_NAME = "BADMINTON_OPEN_LEAGUE";

function getKoleika(label: HTMLElement): Koleika {
    const idWithPrefix = label.getAttribute("for");
    const id = parseInt(idWithPrefix.substring("rez_kole_id".length));
    const description = label.innerText;
    return {id, description};
}

function parseBadmintonOpenLeague(root: HTMLElement): League {
    const dateDiv = root.getElementById("rez_ligi_zapisy_kolejki_rd_div");
    const koleikas = dateDiv.querySelectorAll("label").map(getKoleika);
    const id = BADMINTON_OPEN_LEAGUE_ID;
    const name = BADMINTON_OPEN_LEAGUE_NAME;
    return {id, name, koleikas};
}

export async function getBOL() {
    const resp = await fetch("https://hastalavista.pl/dyscypliny/badminton/liga-open/lista-zgloszen/");
    const text = await resp.text();
    return parseBadmintonOpenLeague(parse(text));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const res2 = await getBOL();
    res.json({"res": res2});
}
