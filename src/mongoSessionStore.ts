import {SessionStore} from "telegraf/typings/session";
import {MongoClient} from "mongodb";
import {MySession} from "./types";

export function getMongoSessionStore(mongoClient: MongoClient): SessionStore<MySession> {
    const sessionCollection = mongoClient.db("somedb").collection<MySession>("session")
    return {
        async delete(name: string): Promise<void> {
            const res = await sessionCollection.deleteOne({_id: name});
            if (!res.acknowledged) {
                throw new Error("failed to delete")
            }
        },
        async set(name: string, value: MySession): Promise<void> {
            const res = await sessionCollection.insertOne(value)
            if (!res.acknowledged) {
                throw new Error("failed to set session")
            }
        },
        async get(name: string) {
            return await sessionCollection.findOne({_id: name})
        }
    }
}
