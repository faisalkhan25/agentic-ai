import { HumanMessage } from "langchain";
import {agentLang } from "./compile-workflow.js";


export const askAgentLang = async (input) => {
    const response = await agentLang.invoke({
        messages: [new HumanMessage(input)]
    });

    console.log(response.messages);

    const finalAnswer = response.messages.at(-1).content;
    return finalAnswer;
};