import { MongoClient } from 'mongodb';

export const getMongoClient = async () => {
    const client = new MongoClient(process.env.DATABASE_URL || '');

    await client.connect();

    return client;
}
