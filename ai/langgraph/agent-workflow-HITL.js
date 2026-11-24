import { END } from "@langchain/langgraph";
import { AIMessage } from "langchain";

export const routeAfterModelCallHITL = async (state) => {
    const lastMessage = state.messages.at(-1);

    if (!lastMessage || !AIMessage.isInstance(lastMessage)) {
        return END;
    }

    const toolCalls = lastMessage.tool_calls ?? [];

    if (toolCalls.length === 0) {
        return END;
    }

    const callsTavilySearch = toolCalls.some(
        
        (toolCall) => toolCall.name === "tavily_search"
    );

    if (callsTavilySearch) {
        return "requestHumanApprovalNodeHITL";
    }

    return "executeToolsNodeHITL";
};

