import {MongoClient} from 'mongodb';

export function getMongoClient(): Promise<MongoClient> {
    if (!process.env.MONGODB_URI) {
        throw new Error('Please add your Mongo URI to .env.local');
    }
    const uri = process.env.MONGODB_URI as string;
    const options = {};
    const client = new MongoClient(uri, options);
    return client.connect()
}
