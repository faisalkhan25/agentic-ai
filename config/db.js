import "dotenv/config";
import { MongoClient } from "mongodb";
import { MongoDBSaver, MongoDBStore } from "@langchain/langgraph-checkpoint-mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const DB_NAME = process.env.MONGODB_DB_NAME || "agentic-ai-chat";

export const mongoClient = new MongoClient(MONGODB_URI);

export const checkpointer = new MongoDBSaver({
    client: mongoClient,
    dbName: DB_NAME,
});

export const store = new MongoDBStore({
    client: mongoClient,
    dbName: DB_NAME,
    collectionName: "user_memories",
});

