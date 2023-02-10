import {NextApiRequest, NextApiResponse} from "next";
import { parse, HTMLElement, Node } from 'node-html-parser';

export type League = {
    id: number,
    name: string,
    koleikas: Koleika[]
}
export type Koleika = {
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

export async function parseKoleikiTable() {
    const all = parse(await getOpenLeagueHtml());
    return all.getElementById("rez_ligi_zapisy_kolejki_rd_div").innerHTML;
}

export async function getOpenLeagueHtml() {
    const resp = await fetch("https://hastalavista.pl/dyscypliny/badminton/liga-open/lista-zgloszen/");
    return await resp.text();
}

export async function getBOL() {
    const text = await getOpenLeagueHtml();
    return parseBadmintonOpenLeague(parse(text));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const res2 = await getBOL();
    res.json({"res": res2});
}


// fetch("https://hastalavista.pl/moje-konto/", {
//   "credentials": "include",
//   "headers": {
//     "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/109.0",
//     "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
//     "Accept-Language": "en-US,en;q=0.5",
//     "Content-Type": "application/x-www-form-urlencoded",
//     "Upgrade-Insecure-Requests": "1",
//     "Sec-Fetch-Dest": "document",
//     "Sec-Fetch-Mode": "navigate",
//     "Sec-Fetch-Site": "same-origin",
//     "Sec-Fetch-User": "?1"
//   },
//   "referrer": "https://hastalavista.pl/moje-konto/",
//   "body": "_wpmem_login_nonce=bd389737e1&_wp_http_referer=%2Fmoje-konto%2F&log=maracuia&pwd=m7dQWCh9%407ew&redirect_to=%2Fmoje-konto%2F&a=login&Submit=Log+in",
//   "method": "POST",
//   "mode": "cors"
// });
//
// await fetch("https://hastalavista.pl/wp-admin/admin-ajax.php", {
//   "credentials": "include",
//   "headers": {
//     "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/109.0",
//     "Accept": "*/*",
//     "Accept-Language": "en-US,en;q=0.5",
//     "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
//     "X-Requested-With": "XMLHttpRequest",
//     "Sec-Fetch-Dest": "empty",
//     "Sec-Fetch-Mode": "cors",
//     "Sec-Fetch-Site": "same-origin"
//   },
//   "referrer": "https://hastalavista.pl/dyscypliny/badminton/liga-open/lista-zgloszen/",
//   "body": "action=LigiZapisyShow&kole_id=8563247&liga_id=8563081",
//   "method": "POST",
//   "mode": "cors"
// });

