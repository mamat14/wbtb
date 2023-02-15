import {MyContext} from "../types";

export async function sendResultsOfKoleika(ctx: MyContext) {
    await ctx.reply("https://hastalavista.pl/dyscypliny/badminton/liga-open/wyniki-ostatniej-kolejki/");
}
