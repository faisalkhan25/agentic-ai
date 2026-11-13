import "dotenv/config";
import { HumanMessage } from "@langchain/core/messages";
import { agent } from "../ai/agent.js";

export async function askAgent(input, userId = "default-user", threadId = "default-thread") {
    const response = await agent.invoke(
        {
            messages: [new HumanMessage(input)],
        },
        {
            configurable: {
                thread_id: threadId,
                user_id: userId,
            },
        }
    );

    const finalAnswer = response.messages.at(-1).content;
    console.log(finalAnswer);
    return finalAnswer;
}


