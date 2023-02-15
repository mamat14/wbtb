import {NextApiRequest, NextApiResponse} from "next";

import {getLoginCookie} from "../../src/cookieGetter";
import {MyContext} from "../../src/types";
import {getBOL} from "../../src/parse/bol";
import {getKoleikaFromMessage} from "../../src/scenes/open_leagues";
import {ruDict} from "../../src/text/ru";
import {BotDictionary} from "../../src/text/dicts";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.json(await getKoleikaFromMessage({
        session: {loginData: {login: "maracuia", pwd: "m7dQWCh9@7ew"}}, getDict(): BotDictionary {
            return ruDict;
        }
    } as MyContext, "вс, 26 февраля 23 г. ➖"));
}

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
