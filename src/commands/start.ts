import {MyContext} from "../types";
import {getSessionId} from "../mongoSessionStore";
import {changeLanguage} from "../scenes/choose_language";

export async function startBot(ctx: MyContext) {
    const sessionId = await getSessionId(ctx);
    ctx.session = {_id: sessionId, loginData: {}, ...ctx.session}
    await changeLanguage(ctx);
}
