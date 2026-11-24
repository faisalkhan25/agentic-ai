import { MessagesValue, ReducedValue, StateSchema } from "@langchain/langgraph";
import z from "zod";

export const agentState = new StateSchema({
    messages: MessagesValue,

    llmCalls: new ReducedValue(

        z.number().default(() => 0),

        { reducer: (oldValue, newValue) => oldValue + newValue }
    ),
})

export const stateHITL = new StateSchema({
    messages: MessagesValue,
    approved: z.boolean().default(false),
    llmCalls: new ReducedValue(
        z.number().default(() => 0),
        { reducer: (oldValue, newValue) => oldValue + newValue }
    ),
});