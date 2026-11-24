import { HumanMessage, SystemMessage } from "langchain";
import { ToolMessage } from "@langchain/core/messages";
import llm, { llm2 } from "../../llm.js";

const SYSTEM_PROMPT_HITL = `You are a helpful AI assistant.
- Use 'tavily_search' when the user asks for real-time information, current events, latest news, or live weather.
- Use 'save_user_memory' when the user shares a personal fact about themselves (name, job, location, skills, preferences).
- Use 'recall_user_memories' when the user asks a question about their own personal facts.
- Use 'add', 'subtract', 'multiply', or 'divide' for arithmetic calculations.`;

const INTENT_CLASSIFIER_PROMPT = `Decide whether the user's message requires calling an external tool or can be answered directly.

Reply with EXACTLY one word — either TOOL or DIRECT:
- Reply TOOL only if the message requires:
  1. Live web search for current events, today's news, real-time data, or live weather.
  2. Saving a personal fact the user is sharing about themselves (e.g., "My name is...", "I live in...", "I am a software engineer").
  3. Recalling a personal fact about the user (e.g., "What is my name?", "Where do I work?").
  4. Arithmetic calculation on numbers (add, subtract, multiply, divide).
- Reply DIRECT for everything else (greetings, general knowledge, definitions, coding help, history, science, or simple questions).

Output ONLY the single word TOOL or DIRECT.`;

const shouldUseTools = async (lastMessage) => {
    if (!lastMessage || !HumanMessage.isInstance(lastMessage)) {
        return false;
    }

    const decision = await llm.invoke([
        new SystemMessage(INTENT_CLASSIFIER_PROMPT),
        new HumanMessage(String(lastMessage.content)),
    ]);

    const normalized = String(decision.content).trim().toUpperCase();
    return normalized.startsWith("TOOL");
};

export const callModelNodeHITL = async (state) => {
    const lastMessage = state.messages.at(-1);

    // If we just received a ToolMessage, use `llm` (without tools) to formulate the final answer
    if (lastMessage && ToolMessage.isInstance(lastMessage)) {
        const response = await llm.invoke([
            new SystemMessage(SYSTEM_PROMPT_HITL),
            ...state.messages,
        ]);

        return {
            messages: [response],
            llmCalls: 1,
        };
    }

    const needsTool = await shouldUseTools(lastMessage);
    const activeModel = needsTool ? llm2 : llm;

    const response = await activeModel.invoke([
        new SystemMessage(SYSTEM_PROMPT_HITL),
        ...state.messages,
    ]);

    return {
        messages: [response],
        llmCalls: 1,
    };
};

