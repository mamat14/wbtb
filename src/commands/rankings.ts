import {MyContext} from "../types";

export async function sendRankings(ctx: MyContext) {
    await ctx.reply("https://t.me/iv?url=https%3A%2F%2Fhastalavista.pl%2Fdyscypliny%2Fbadminton%2Fliga-open%2Franking%2F&rhash=adcae2e48d9b3a");
}
