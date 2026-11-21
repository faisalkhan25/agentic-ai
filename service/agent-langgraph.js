import { HumanMessage } from "langchain";
import { agent } from "./compile-workflow.js";


export const askAgent = async (input) => {
    const response = await agent.invoke({
        messages: [new HumanMessage(input)]
    });

    console.log(response.messages);

    const finalAnswer = response.messages.at(-1).content;
    return finalAnswer;
};