import {cmds} from "./names";
import {sendMainMenu} from "./main_menu";
import {MyContext} from "../types";
import {getSessionId} from "../mongoSessionStore";
import {startBotScene} from "../scenes/start";

export async function startBot(ctx: MyContext) {
    ctx.session = {_id: getSessionId(ctx), loginData: {}, ...ctx.session}
    if(!ctx.session.dictId) {
        await startBotScene(ctx);
    } else {

    }
}
