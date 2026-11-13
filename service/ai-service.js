import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import llm from "../ai/llm.js";

export async function askAI(input) {
    const response = await llm.invoke([
        new SystemMessage("You are a Senior Software Engineer and also a Phelospher"),
        new HumanMessage(input)
    ]);
    return response;
}
