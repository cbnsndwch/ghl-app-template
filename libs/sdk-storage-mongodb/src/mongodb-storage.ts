import { MongoClient, Db, Collection } from 'mongodb';
import { BaseSessionStorage, ISessionData } from '@cbnsndwch/ghl-sdk-storage';

/**
 * MongoDB implementation of SessionStorage
 * Provides MongoDB-based storage for sessions, tokens, and related data
 */
export class MongoDBSessionStorage extends BaseSessionStorage {
    private client: MongoClient | null = null;
    private db: Db | null = null;
    private collection: Collection<ISessionData> | null = null;
    private dbUrl: string;
    private dbName: string;
    private collectionName: string;
    private isConnected: boolean = false;

    constructor(
        dbUrl: string,
        dbName: string,
        collectionName: string = 'ghl_sessions'
    ) {
        super();
        this.dbUrl = dbUrl;
        this.dbName = dbName;
        this.collectionName = collectionName;
    }

    /**
     * Initialize the MongoDB connection
     */
    async init(): Promise<void> {
        try {
            this.client = new MongoClient(this.dbUrl);
            await this.client.connect();
            this.db = this.client.db(this.dbName);
            this.collection = this.db.collection<ISessionData>(
                this.collectionName
            );

            // Create indexes
            await this.collection.createIndex(
                { resourceId: 1 },
                { unique: true }
            );
            await this.collection.createIndex({ expire_at: 1 });

            this.isConnected = true;
        } catch (error) {
            throw new Error(`Failed to connect to MongoDB: ${error}`);
        }
    }

    /**
     * Close the MongoDB connection
     */
    async disconnect(): Promise<void> {
        if (this.isConnected && this.client) {
            await this.client.close();
            this.isConnected = false;
            this.db = null;
            this.collection = null;
            this.client = null;
        }
    }

    private ensureConnected(): Collection<ISessionData> {
        if (!this.collection) {
            throw new Error('MongoDB not initialized. Call init() first.');
        }
        return this.collection;
    }

    /**
     * Store a session in MongoDB
     * @param resourceId - Unique identifier: it can be a companyId or a locationId
     * @param sessionData - Session data to store
     */
    async setSession(
        resourceId: string,
        sessionData: ISessionData
    ): Promise<void> {
        const collection = this.ensureConnected();
        const uniqueKey = this.generateUniqueKey(resourceId);

        // Calculate expiration if needed
        if (sessionData.expires_in && !sessionData.expire_at) {
            sessionData.expire_at = Date.now() + sessionData.expires_in * 1000;
        }

        await collection.updateOne(
            { resourceId: uniqueKey },
            {
                $set: {
                    ...sessionData,
                    resourceId: uniqueKey,
                    updatedAt: new Date()
                }
            },
            { upsert: true }
        );
    }

    /**
     * Retrieve a session from MongoDB
     * @param resourceId - Unique identifier: it can be a companyId or a locationId
     * @returns Session data or null if not found
     */
    async getSession(resourceId: string): Promise<ISessionData | null> {
        const collection = this.ensureConnected();
        const uniqueKey = this.generateUniqueKey(resourceId);

        const session = await collection.findOne({ resourceId: uniqueKey });
        return session || null;
    }

    /**
     * Delete a session from MongoDB
     * @param resourceId - Unique identifier: it can be a companyId or a locationId
     */
    async deleteSession(resourceId: string): Promise<void> {
        const collection = this.ensureConnected();
        const uniqueKey = this.generateUniqueKey(resourceId);

        await collection.deleteOne({ resourceId: uniqueKey });
    }

    /**
     * Check if a session exists in MongoDB
     * @param resourceId - Unique identifier: it can be a companyId or a locationId
     * @returns True if session exists
     */
    async hasSession(resourceId: string): Promise<boolean> {
        const collection = this.ensureConnected();
        const uniqueKey = this.generateUniqueKey(resourceId);

        const count = await collection.countDocuments({
            resourceId: uniqueKey
        });
        return count > 0;
    }

    /**
     * Check if the storage is initialized
     * @returns Initialization status
     */
    public isStorageActive(): boolean {
        return this.isConnected;
    }
}
