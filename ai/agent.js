import { createAgent, SystemMessage } from "langchain";
import { checkpointer, store } from "../config/db.js";
import llm, { llm2 } from "./llm.js";
import { saveMemoryTool, recallMemoryTool } from "./tools/memory.tool.js";
import { searchTool } from "./tools/search.tool.js";

export const agent = createAgent({
    model: llm,
    tools: [searchTool, saveMemoryTool, recallMemoryTool],
    checkpointer,
    store,
    systemPrompt: `You are a helpful AI assistant with web search and long-term memory tools.
- When the user tells you a personal fact (e.g., their name, job, location, skills), call 'save_user_memory' to store it, then reply naturally.
- When the user asks a question about themselves (e.g., "what is my name?", "who am I?"), call 'recall_user_memories' once and use the result to answer.
- Use 'tavily_search' only for current events or live web information.`,
});


export const modelNode = async (state) => {
    const response = await llm2.invoke([
        new SystemMessage(
            "You are a helpfull assistant tasked with performing web search uisng tavily_search tool. Save the user information using save_user_memory tool and recall the user information using recall_user_memories tool. If you have to perform the arithmatic operations you have add,subtract, divide, multiply tools"
        ),
        [...state.messages]
    ])

    return {
        messages: [response],
        llmCalls: 1,
    }
}
