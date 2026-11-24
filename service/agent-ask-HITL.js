import { HumanMessage } from "langchain";
import { isInterrupted } from "@langchain/langgraph";
import { agentGraphHITL } from "./compile-workflow-HITL.js";

export const askAgentWithHITL = async (
    input,
    threadId = "default-thread",
    userId = "default-user"
) => {
    const config = {
        configurable: {
            thread_id: String(threadId),
            user_id: String(userId),
        },
    };

    const response = await agentGraphHITL.invoke(
        {
            messages: [new HumanMessage(input)],
        },
        config
    );

    if (isInterrupted(response) || response.__interrupt__?.length) {
        const interruptPayload = response.__interrupt__?.[0]?.value;
        return {
            approvalRequired: true,
            interruptDetails: interruptPayload,
            message:
                "Permission required to execute tavily_search. Send POST /workflow/hitl/approve with { threadId, userId, approved: true | false }.",
        };
    }

    const finalAnswer = response.messages.at(-1)?.content ?? "";

    return {
        approvalRequired: false,
        message: finalAnswer,
    };
};

