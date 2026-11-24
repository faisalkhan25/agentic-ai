import { Command } from "@langchain/langgraph";
import { agentGraphHITL } from "./compile-workflow-HITL.js";

export const approveAgentToolCallHITL = async (
    approved,
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
        new Command({ resume: Boolean(approved) }),
        config
    );

    const finalAnswer = response.messages.at(-1)?.content ?? "";

    return {
        approved: Boolean(approved),
        approvalRequired: false,
        message: finalAnswer,
    };
};

