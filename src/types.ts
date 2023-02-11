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

export class MyContext extends Context {
    session: MySession
    scene: Scenes.SceneContextScene<MyContext, Scenes.WizardSessionData>;
    wizard: Scenes.WizardContextWizard<MyContext>;

    getDict(): BotDictionary {
        const dictId = this.session.dictId;
        if (dictId && dicts[dictId]) {
            return dicts[dictId]
        } else {
            throw new Error("dictId is not defined")
        }
    }

    constructor(update: Update, telegram: Telegram, botInfo: UserFromGetMe) {
        console.log('Creating context for %j', update)
        super(update, telegram, botInfo)
        this.session = undefined;
        this.scene = undefined;
        this.wizard = undefined;
    }
}
