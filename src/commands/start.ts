import {MyContext} from "../types";
import {getSessionId} from "../mongoSessionStore";
import {startBotScene} from "../scenes/start";

export async function startBot(ctx: MyContext) {
    ctx.session = {_id: getSessionId(ctx), loginData: {}, ...ctx.session}
    await startBotScene(ctx);
}
