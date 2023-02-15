import {ruDict} from "./ru";

export const dicts: Record<DictKey, BotDictionary> = {
    "ru": ruDict
};

export const langNames: Record<DictKey, string> = {
    "ru": "Русский"
};

export type DictKey = "ru"

export type BotDictionary = {
    locale: string,
    greet: string,
    thank_you: string,
    look_future_open_leagues: string,
    look_all_open_leagues: string,
    high_here_are_the_leagues: string,
    main_menu: string,
    help: string,
    login: string,
    enter_hasta_website_login: string,
    enter_hasta_website_pwd: string,
    thank_you_for_login: string,
    enter_preffered_language_pls: string,
    unknown_command: string,
    internal_error: string,
    need_login_to_register_for_the_leagues: string,
    successfully_registered: string,
    successfully_unregistered: string,
}
