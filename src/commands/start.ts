import {cmds} from "./names";
import {sendMainMenu} from "./main_menu";
import {MyContext} from "../types";

export async function startBot(ctx: MyContext) {
    await ctx.telegram.setMyCommands([
        {command: cmds.main_menu, description: ctx.getDict().main_menu}
    ]);
    await sendMainMenu(ctx);
}
