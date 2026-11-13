import { randomUUID } from "node:crypto";
import { tool } from "langchain";
import { z } from "zod";
import { store } from "../../config/db.js";
import { embeddings } from "../llm.js";

function cosineSimilarity(vecA, vecB) {
    if (!Array.isArray(vecA) || !Array.isArray(vecB) || vecA.length !== vecB.length) {
        return -1;
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export const saveMemoryTool = tool(
    async ({ fact }, config) => {
        const userId = config?.configurable?.user_id || "default-user";
        const memoryId = `memoryId-${randomUUID()}`;

        const embedding = await embeddings.embedQuery(fact);

        await store.put(["memories", userId], memoryId, {
            fact,
            embedding,
        });

        return `Saved to memory: "${fact}"`;
    },
    {
        name: "save_user_memory",
        description: "Save an important personal fact or preference about the user (e.g., name, role, company, location, skills) to long-term memory.",
        schema: z.object({
            fact: z.string().describe("A clear sentence describing the fact to remember about the user"),
        }),
    }
);

export const recallMemoryTool = tool(
    async ({ query }, config) => {

        const userId = config?.configurable?.user_id || "default-user";

        const memories = await store.search(["memories", userId]);

        if (memories.length === 0) {
            return "No saved memories found for this user.";
        }


        const queryEmbedding = await embeddings.embedQuery(query);

        const rankedMemories = memories
            .map((item) => ({
                fact: item.value.fact,
                score: cosineSimilarity(queryEmbedding, item.value.embedding),
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);

        return rankedMemories.map((item) => item.value.fact).join("\n");
    },
    {
        name: "recall_user_memories",
        description: "Search and retrieve relevant long-term facts about the user using semantic similarity when they ask about themselves or when personal context is needed.",
        schema: z.object({
            query: z.string().describe("The topic or question to search for in the user's memories (e.g., 'user name', 'workplace and job', 'hobbies')"),
        }),
    }
);
