import { AIMessage } from "langchain";
import { ToolMessage } from "@langchain/core/messages";
import { toolsByName } from "../../llm.js";

export const executeToolsNodeHITL = async (state, config) => {
    
    const lastMessage = state.messages.at(-1);

    if (lastMessage == null || !AIMessage.isInstance(lastMessage)) {
        return { messages: [] };
    }

    const toolMessages = [];

    for (const toolCall of lastMessage.tool_calls ?? []) {
        const isTavilySearch = toolCall.name === "tavily_search";

        if (isTavilySearch && !state.approved) {
            const rejectionMessage = new ToolMessage({
                content:
                    "User rejected permission to execute tavily_search. Do not search the web; politely inform the user or answer using only what you already know.",
                name: toolCall.name,
                tool_call_id: toolCall.id,
            });
            toolMessages.push(rejectionMessage);
            continue;
        }

        const tool = toolsByName[toolCall.name];
        const observation = await tool.invoke(toolCall, config);
        toolMessages.push(observation);
    }

    return { messages: toolMessages };
};

