import {NextApiRequest, NextApiResponse} from "next";
import {getBOL} from "../../src/parse/bol";
import {createBot} from "./bot-8a8d9df5-3b8b-4ff6-8bab-b012aa451fb1";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const res2 = await createBot();
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

