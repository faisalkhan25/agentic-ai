import { createAgent } from "langchain";
import { checkpointer, store } from "../config/db.js";
import llm from "./llm.js";
import { saveMemoryTool, recallMemoryTool } from "./tools/memory.tool.js";
import { searchTool } from "./tools/search.tool.js";

export const agent = createAgent({
    model: llm,
    tools: [searchTool, saveMemoryTool, recallMemoryTool],
    checkpointer,
    store,
    systemPrompt: `You are a helpful AI assistant with web search and long-term memory tools.
- When the user shares personal facts about themselves (e.g., name, job, company, location, skills, preferences), ALWAYS call 'save_user_memory' to store the fact.
- When the user asks about themselves (e.g., "who am I?", "what is my name?"), ALWAYS call 'recall_user_memories' to retrieve stored facts.
- Use 'tavily_search' only when a question requires current events or live web information.`,
});
