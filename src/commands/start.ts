import {MyContext} from "../types";
import {getSessionId} from "../mongoSessionStore";
import {startBotScene} from "../scenes/start";

export async function startBot(ctx: MyContext) {
    const sessionId = await getSessionId(ctx);
    ctx.session = {_id: sessionId, loginData: {}, ...ctx.session}
    await startBotScene(ctx);
}
