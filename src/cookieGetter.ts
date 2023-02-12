import {MyContext} from "./types";
import parse, {Cookie} from "set-cookie-parser";
import fetch from 'node-fetch';
import * as nodeCookie from "cookie";

async function loginAndGetSecCookie(ctx: MyContext): Promise<Cookie> {
    const body = `log=${encodeURIComponent(ctx.session.loginData.login)}&pwd=${encodeURIComponent(ctx.session.loginData.pwd)}&a=login`;
    const resp = await fetch("https://hastalavista.pl/moje-konto/", {
        "headers": {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate, br",
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": body.length.toString(),
        },
        "body": body,
        "method": "POST",
        "redirect": "manual"
    });

    let setCookie = resp.headers.raw()['set-cookie'];
    let res = parse(setCookie, {decodeValues: true, silent: false, map: false});
    if (!Array.isArray(res)) {
        throw new Error("expected array")
    }
    const secCookie = res.find(x => x.name.startsWith("wordpress_sec_"))
    if (!setCookie) {
        throw new Error("set cookie not found")
    }

    return secCookie;
}

export async function getLoginCookie(ctx: MyContext): Promise<string> {
    const cookie = await loginAndGetSecCookie(ctx);
    return nodeCookie.serialize(cookie.name, cookie.value);
}
