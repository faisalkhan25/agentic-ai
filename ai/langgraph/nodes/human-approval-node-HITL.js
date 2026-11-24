import { interrupt } from "@langchain/langgraph";

export const requestHumanApprovalNodeHITL = async (state) => {

    const lastMessage = state.messages.at(-1);
    
    const tavilyToolCalls = (lastMessage?.tool_calls ?? []).filter(
        (toolCall) => toolCall.name === "tavily_search"
    );

    const userDecision = interrupt({
        question: "Do you approve executing the tavily_search web search tool?",
        tool: "tavily_search",
        queries: tavilyToolCalls.map((toolCall) => toolCall.args?.query),
    });

    const isApproved = Boolean(userDecision);

    return {
        approved: isApproved,
    };
};

