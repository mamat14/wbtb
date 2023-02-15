import {ruDict} from "./ru";
import {uaDict} from "./ua";

export const dicts: Record<DictKey, BotDictionary> = {
    "ru": ruDict,
    "ua": uaDict,
};

export const langNames: Record<DictKey, string> = {
    "ru": "Русский",
    "ua": "Українська"
};

export type DictKey = "ru" | "ua"

export type BotDictionary = {
    locale: string,
    greet: string,
    yes: string,
    no: string,
    thank_you: string,
    look_future_open_leagues: string,
    look_all_open_leagues: string,
    high_here_are_the_leagues: string,
    main_menu: string,
    help: string,
    login: string,
    logout: string,
    enter_hasta_website_login: string,
    enter_hasta_website_pwd: string,
    thank_you_for_login: string,
    enter_preffered_language_pls: string,
    unknown_command: string,
    internal_error: string,
    need_login_to_register_for_the_leagues: string,
    successfully_registered: string,
    successfully_unregistered: string,
    are_you_sure_to_logout: string,
    enter_yes_or_no: string,
    successfully_logged_out: string,
}
