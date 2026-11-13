import { randomUUID } from "node:crypto";
import { tool } from "langchain";
import { z } from "zod";
import { store } from "../../config/db.js";
import { embeddings } from "../llm.js";

function cosineSimilarity(vecA, vecB) {
    if (!Array.isArray(vecA) || !Array.isArray(vecB) || vecA.length !== vecB.length) {
        return 0;
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
        try {
            const userId = config?.configurable?.user_id || "default-user";
            const memoryId = `memoryId-${randomUUID()}`;

            console.log(`[saveMemoryTool] Saving for user "${userId}":`, fact);
            const embedding = await embeddings.embedQuery(fact);

            await store.put(["memories", userId], memoryId, {
                fact,
                embedding,
            });

            return `Successfully saved to memory: "${fact}"`;
        } catch (err) {
            console.error("[saveMemoryTool] Error:", err.message);
            return `Failed to save memory: ${err.message}`;
        }
    },
    {
        name: "save_user_memory",
        description: "Save a personal fact about the user (such as name, job, company, location, skills, or preferences) to long-term memory.",
        schema: z.object({
            fact: z.string().describe("The personal fact about the user to save, e.g. 'User name is Faisal Khan'"),
        }),
    }
);

export const recallMemoryTool = tool(
    async ({ query }, config) => {
        try {
            const userId = config?.configurable?.user_id || "default-user";
            const memories = await store.search(["memories", userId]);

            console.log(`[recallMemoryTool] Found ${memories.length} memories for user "${userId}" (query: "${query}")`);

            if (memories.length === 0) {
                return "No memories are stored for this user yet. Tell the user you don't know yet.";
            }

            const queryEmbedding = await embeddings.embedQuery(query);

            const rankedMemories = memories
                .map((item) => ({
                    fact: item.value.fact,
                    score: cosineSimilarity(queryEmbedding, item.value.embedding),
                }))
                .sort((a, b) => b.score - a.score)
                .slice(0, 5);


            return rankedMemories.map((item) => item.fact).join("\n");
        } catch (err) {
            console.error("[recallMemoryTool] Error:", err.message);
            return `Failed to recall memories: ${err.message}`;
        }
    },
    {
        name: "recall_user_memories",
        description: "Retrieve saved personal facts about the user (such as their name, job, location, or preferences) from long-term memory.",
        schema: z.object({
            query: z.string().describe("What to search for in the user's memory, e.g. 'name', 'job', 'location'"),
        }),
    }
);
