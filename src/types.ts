import {Scenes, Context, Telegram} from "telegraf";
import {BotDictionary, DictKey, dicts} from "./text/dicts";
import {Update, UserFromGetMe} from "typegram";

interface LoginData {
    login?: string,
    pwd?: string
}

export interface MySession extends Scenes.WizardSession {
    _id: string;
    loginData: LoginData;
    dictId?: DictKey;
}

export interface MyContext extends Context {
    session: MySession
    scene: Scenes.SceneContextScene<MyContext, Scenes.WizardSessionData>;
    wizard: Scenes.WizardContextWizard<MyContext>;
    getDict(): BotDictionary
}
