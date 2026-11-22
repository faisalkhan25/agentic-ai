import { HumanMessage } from "langchain";
import {agentLang } from "./compile-workflow.js";


export const askAgentLang = async (input, threadId = "default-thread", userId = "default-user") => {

    const config = {
        configurable: {
            thread_id: String(threadId),
            user_id: String(userId)
        }
    };

    const response = await agentLang.invoke(
        {
            messages: [new HumanMessage(input)],
        },
        config
    );

    console.log(response.messages);

    const finalAnswer = response.messages.at(-1).content;
    return finalAnswer;
};