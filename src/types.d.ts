import {Scenes, Context} from "telegraf";
import {BotDictionary, DictKey} from "./text/dicts";

interface LoginData {
    login?: string,
    pwd?: string
}

export interface MySession extends Scenes.WizardSession {
    _id: string;
    loginData: LoginData;
    dictId: DictKey;
}

export interface MyContext extends Context {
    session: MySession
    scene: Scenes.SceneContextScene<MyContext, Scenes.WizardSessionData>;
    wizard: Scenes.WizardContextWizard<MyContext>;
    ses: MySessionWrapper
}

interface MySessionWrapper extends MySession {
    dict: BotDictionary
}
