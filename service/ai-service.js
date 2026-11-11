import llm from "../ai/llm.js";

export async function askAI(input) {
    const response = await llm.invoke(input);
    return response;
}
