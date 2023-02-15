import {MyContext} from "../types";
import {sendMainMenu} from "./main_menu";

export async function logout(ctx: MyContext): Promise<void> {
    ctx.session.loginData = {};
    await sendMainMenu(ctx);
}
